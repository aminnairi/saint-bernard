import { defineConfig } from 'vitepress'

// https://vitepress.vuejs.org/config/app-configs
export default defineConfig({
  title: "saint-bernard",
  outDir: "../../docs",
  themeConfig: {
    sidebar: [
      {
        text: "Introduction",
        items: [
          {
            text: "Getting Started",
            link: "/introduction/getting-started"
          }
        ]
      },
      {
        text: "Examples",
        items: [
          {
            text: "Timeout",
            link: "/examples/timeout"
          }
        ]
      },
      {
        text: "API",
        items: [
          {
            text: "useStatefulRequest",
            link: "/api/use-stateful-request"
          },
          {
            text: "useStatelessRequest",
            link: "/api/use-stateless-request"
          },
          {
            text: "isError",
            link: "/api/is-error"
          },
          {
            text: "match",
            link: "/api/match"
          },
          {
            text: "ExpectedError",
            link: "/api/expected-error"
          }
        ]
      }
  ]
  }
})
