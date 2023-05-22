import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import packageJson from "./package.json";

// https://react-icons.github.io/react-icons/icons?name=md

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version),
    "import.meta.env.PACKAGE_VERSION": JSON.stringify(packageJson.version),
  },
});
