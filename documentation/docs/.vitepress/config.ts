import { defineConfig } from 'vitepress'

// https://vitepress.vuejs.org/config/app-configs
export default defineConfig({
  title: "saint-bernard",
  description: "Official documentation website for the saint-bernard Node.js library.",
  outDir: "../../docs",
  base: "/saint-bernard",
  themeConfig: {
    nav: [
      {
        text: "GitHub",
        link: "https://github.com/aminnairi/saint-bernard"
      },
      {
        text: "NPM",
        link: "https://npmjs.com/package/saint-bernard"
      }
    ],
    sidebar: [
      {
        text: "Introduction",
        items: [
          {
            text: "Getting Started",
            link: "/introduction/getting-started"
          },
          {
            text: "Strict mode",
            link: "/introduction/strict-mode"
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
