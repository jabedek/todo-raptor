import * as fs from "fs";
import * as path from "path";
import * as FFmpeg from "js-ffmpeg";
import * as archiver from "archiver";
import { default as inquirer } from "inquirer";
import { dialog } from "electron";
import { BetaJSPromise } from "js-ffmpeg/types/betajs";

interface Duration {
  raw: string;
  seconds: number;
}
export class MovieSplitter {
  async uploadMovie(): Promise<void> {
    const result = await dialog.showOpenDialog({
      properties: ["openFile"],
      filters: [{ name: "Movies", extensions: ["mp4", "mpeg", "avi", "mkv", "webm"] }],
    });

    if (!result.canceled && result.filePaths.length > 0) {
      const filePath = result.filePaths[0];
      const fileExtension = path.extname(filePath);
      const validExtensions = [".mp4", ".mpeg", ".avi", ".mkv", ".webm"];

      if (!validExtensions.includes(fileExtension)) {
        throw new Error(
          `Invalid file extension. Please upload a file with one of the following extensions: ${validExtensions.join(", ")}.`
        );
      }

      const duration = await this.getDuration(filePath);
      const segmentDuration = duration.seconds / 10;
      const outputPaths: string[] = [];

      for (let i = 1; i <= 10; i++) {
        const segmentOutputPath = `${path.basename(filePath, fileExtension)}_segment_${i}.${fileExtension}`;
        const startTime = segmentDuration * (i - 1);
        await this.splitSegment(filePath, segmentOutputPath, startTime, segmentDuration);
        outputPaths.push(segmentOutputPath);
      }

      const archivePath = await this.promptDestinationPath();
      const archive = archiver("zip");

      const outputStream = fs.createWriteStream(archivePath);
      archive.pipe(outputStream);

      for (const outputPath of outputPaths) {
        const fileName = path.basename(outputPath);
        archive.file(outputPath, { name: fileName });
      }

      await archive.finalize();

      console.log(`Segments saved to ${archivePath}`);
    }
  }

  private async getDuration(inputPath: string): Promise<Duration> {
    const probeResult: BetaJSPromise<FFmpeg.TFFProbeResponse> = await FFmpeg.ffprobe(inputPath);
    const rawDuration = (await probeResult.toNativePromise()).format.duration as string;
    const seconds = parseFloat(rawDuration);
    return { raw: rawDuration, seconds };
  }

  private async splitSegment(inputPath: string, outputPath: string, startTime: number, duration: number) {
      const input = (await FFmpeg.ffmpeg(inputPath).toNativePromise());
    
  const output = FFmpeg.ffmpeg.(input, outputPath).seek(startTime).duration(duration).audioCodec("copy").videoCodec("copy");

  await output.run();
  }

  private async promptDestinationPath(): Promise<string> {
    const answer = await inquirer.prompt({
      type: "input",
      name: "destination",
      message: "Enter destination path for the saved segments:",
      validate: (input: string) => {
        if (!fs.existsSync(input) || !fs.lstatSync(input).isDirectory()) {
          return "Please enter a valid directory path.";
        }
        return true;
      },
    });

    return path.join(answer.destination, "segments.zip");
  }
}
