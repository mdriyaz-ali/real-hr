import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "RealHRsoft Documentation",
  description: " ",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/src' },
      { text: 'Docs', link: '/src/introduction' }
    ],

    sidebar: [
      {
        text: '',
        items: [
          { text: 'Introduction', link: '/src/introduction' },
          { text: 'Pre-requesites & Pre-setup', link: '/src/setup' },
          { text: 'File Structure', link: '/src/file-structure' },
          { text: 'Backend Setup(Cloud Based)', link: '/src/backend-setup-cloud' },
          { text: 'Backend Setup(On Premise)', link: '/src/backend-setup-onprem' },
          { text: 'Frontend Setup', link: '/src/frontend-setup'},
          { text: 'Attendence Sync Method', link: '/src/Attendence-sync-realsoft'},
          { text: 'Docker-registry Setup', link: '/src/Docker-registry'},
          { text: 'Docker Client setup on Local Machine', link: '/src/Docker-client-pc'},
          { text: 'Deployment and version update with Ansible', link: '/src/Deployment-version-ansible'},
          { text: 'Monitoring with realsoft', link: '/src/Monitoring with RealSoft'},
          { text: 'HikVision Device', link: '/src/HikVision-configuration'},

        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],search: {
      provider: 'local'
    }
  }
})
