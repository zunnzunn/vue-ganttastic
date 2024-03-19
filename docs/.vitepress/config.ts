import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'en-US',
  title: 'Vue-Ganttastic',
  description: 'Simple and customizable Gantt chart component for Vue 3.',
  base: '/vue-ganttastic/',
  head: [['link', { rel: 'icon', href: 'https://user-images.githubusercontent.com/28678851/148047714-301f07df-4101-48b8-9e47-1f272b290e80.png' }]],
  themeConfig: {
    logo: 'https://user-images.githubusercontent.com/28678851/148047714-301f07df-4101-48b8-9e47-1f272b290e80.png',
    nav: [
      { text: 'Home', link: '/' },
    ],
    sidebar: [
      { text: 'Introduction', link: '/introduction'},
      { text: 'Getting Started',link: '/getting-started' },
      { text: 'Common use cases', link: '/common-use-cases' },
      { text: 'Examples', link: '/examples' },
      {
        text: 'API Reference',
        items: [
          { text: 'GGanttChart', link: '/GGanttChart' },
          { text: 'GGanttRow', link: '/GGanttRow' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/zunnzunn/vue-ganttastic' }
    ]
  }
})
