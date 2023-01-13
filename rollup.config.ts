import { defineConfig } from "rollup"
import esbuild from "rollup-plugin-esbuild"
import terser from "@rollup/plugin-terser"

export default defineConfig({
  input: "./hooks/index.ts",
  external: [
    "react"
  ],
  plugins: [
    esbuild(),
    terser()
  ],
  output: [
    {
      file: "build/index.js",
      format: "esm"
    },
    {
      file: "build/index.umd.js",
      format: "umd",
      name: "SaintBernard",
      globals: {
        react: "React"
      }
    }
  ]
})
