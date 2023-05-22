/// <reference types="vite/client" />
/// <reference types="@types/react" />
declare const APP_VERSION: string;

interface ImportMetaEnv {
  readonly PACKAGE_VERSION: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
