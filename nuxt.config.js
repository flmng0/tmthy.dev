export default {
  head: {
    titleTemplate: "%s | Tim's Portfolio",
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width,initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
  },
  target: 'static',
  srcDir: 'src/',
  modules: ['@nuxt/content'],
  content: {},
  components: true,
}
