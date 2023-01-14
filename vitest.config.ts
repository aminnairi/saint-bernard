import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "happy-dom",
    coverage: {
      enabled: true
    }
  }
})