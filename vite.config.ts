import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";

// https://vite.dev/config/
export default defineConfig({
  base: "/noviga-assignment/",
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  resolve: {
    alias: [
      {
        find: /^@mui\/styled-engine$/,
        replacement: "@mui/styled-engine-sc",
      },
    ],
  },
});
