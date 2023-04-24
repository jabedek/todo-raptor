export type ResultDisplay = { text: string; isError: boolean };

export enum StorageItem {
  USER = "USER",
}

export type RoutingState = {
  state: "idle" | "loading" | "submitting";
  location: string;
};

export type VisualElements = {
  colorPrimary: string;
  colorSecondary: string;
  colorTertiary: string;
};
