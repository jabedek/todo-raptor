import { UserConfigExport, loadEnv } from "vite";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import packageJson from "./package.json";

// https://react-icons.github.io/react-icons/icons?name=md
// https://vitejs.dev/config/

export default ({ mode }: { mode: string }): UserConfigExport => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [react(), tsconfigPaths()],
    test: {
      environment: "jsdom",
    },
    define: {
      APP_VERSION: JSON.stringify(process.env.npm_package_version),
      "import.meta.env.PACKAGE_VERSION": JSON.stringify(packageJson.version),
    },

    build: {
      cssCodeSplit: true,
      chunkSizeWarningLimit: 1000,
    },
  });
};
