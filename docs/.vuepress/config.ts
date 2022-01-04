import { defineUserConfig } from 'vuepress'
import type { DefaultThemeOptions } from 'vuepress'
const { path } = require('@vuepress/utils')

export default defineUserConfig<DefaultThemeOptions>({
  // site config
  lang: "en-US",
  title: "Vue Ganttastic",
  description: "A simple and customizable Gantt chart component for Vue",
  clientAppEnhanceFiles: path.resolve(
    __dirname,
    './clientAppEnhance.ts'
  ),
  // theme and its config
  themeConfig: {
    logo: 'https://user-images.githubusercontent.com/28678851/148047714-301f07df-4101-48b8-9e47-1f272b290e80.png',
    extractHeaders: true,
    themePlugins: {
      activeHeaderLinks: true
    },
    navbar: [
      {
        text: 'GitHub',
        link: 'https://github.com/InfectoOne/vue-ganttastic',
      }
    ],
    sidebar: [

      {
        text: "Introduction",
        link: "/introduction/introduction.md" 
      },

      {
        text: "Getting started",
        link: "/getting-started/getting-started.md"
      },

      {
        text: "Common use cases",
        link: "/common-use-cases/common-use-cases.md" 
      },

      {
        text: "Examples",
        link: "/examples/examples.md" 
      },

      {
        text: "Component Reference",
        link: "/component-reference/GGanttChart.md",
        children: [
          {
            text: "GGanttChart",
            link: "/component-reference/GGanttChart.md",
          },
          {
            text: "GGanttRow",
            link: "/component-reference/GGanttRow.md",
          },
        ]
      },
    ]
  },
})