export enum DateFormats {
  "YYYY-MM-DD",
  "YYYY-MM-DD HH:MM",
  "YYYY/MM/DD",
  "YYYY/MM/DD HH:MM",
}

export class DateFormatter {
  static formatToString(isoString: string, format: DateFormats) {
    const year = new Date(isoString).getFullYear().toString();
    const month = (new Date(isoString).getMonth() + 1).toString().padStart(2, "0");
    const day = new Date(isoString).getDate().toString().padStart(2, "0");

    const hour = new Date(isoString).getHours().toString().padStart(2, "0");
    const minute = new Date(isoString).getMinutes().toString().padStart(2, "0");
    const second = new Date(isoString).getSeconds().toString().padStart(2, "0");

    let divider = "";

    if ([DateFormats["YYYY-MM-DD"], DateFormats["YYYY-MM-DD HH:MM"]].includes(format)) {
      divider = "-";
    }

    if ([DateFormats["YYYY/MM/DD"], DateFormats["YYYY/MM/DD HH:MM"]].includes(format)) {
      divider = "/";
    }

    let finalDate = `${year}${divider}${month}${divider}${day}`;

    if ([DateFormats["YYYY-MM-DD HH:MM"], DateFormats["YYYY/MM/DD HH:MM"]].includes(format)) {
      finalDate += ` ${hour}:${minute}`;
    }

    return finalDate;
  }
}
