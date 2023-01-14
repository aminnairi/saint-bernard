import { defineConfig } from "rollup"
import esbuild from "rollup-plugin-esbuild"
import terser from "@rollup/plugin-terser"
import remove from "rollup-plugin-delete"

export default defineConfig({
  input: "./hooks/index.ts",
  external: [
    "react"
  ],
  plugins: [
    remove({
      verbose: true,
      runOnce: true,
      targets: [
        "build/*",
        "types/*"
      ]
    }),
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
