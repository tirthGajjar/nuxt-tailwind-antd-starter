import path from 'path'
import { NuxtConfig } from '@nuxt/types'
import webpack from 'webpack'

const config: NuxtConfig = {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'universal',
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'static',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: 'RAx',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: ['@/plugins/composition-api'],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ['@nuxt/typescript-build', '@nuxtjs/tailwindcss'],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    extend(config: any) {
      // bunlde size too large #325
      // https://github.com/vueComponent/ant-design-vue/issues/325#issue-393050881
      config.plugins?.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^\.\/locale$/,
          contextRegExp: /moment$/,
        })
      )
      // dist/icons is huge, so import only the icons we need
      // https://github.com/vercel/next.js/issues/4101#issuecomment-456719039
      if (config.resolve?.alias) {
        config.resolve.alias['@ant-design/icons/lib/dist$'] = path.join(
          __dirname,
          './utils/antd-icons.js'
        )
      }
    },
    // Config to use ant-design-vue in efficient way
    /* TODO: We are using less-loader 5.0.0 because limited typescript support
       We have to upgrade to use it 6.0.0 when type definitions are updated
       Also, change the below options to use
       
      loaders: {
        ...
        less: {
          lessOptions: {
            javascriptEnabled: true,
            modifyVars: { '@primary-color': '#1DA57A' },
          }
        },
        ...
      },
     */
    loaders: {
      less: {
        javascriptEnabled: true,
      },
    },
    transpile: [/^ant-design-vue($|\/)/],
    // Use modularized antd #https://antdv.com/docs/vue/introduce/#Use-modularized-antd
    babel: {
      plugins: [
        [
          'import',
          {
            libraryName: 'ant-design-vue',
            libraryDirectory: 'lib',
            style: true,
          },
          'ant-design-vue',
        ],
      ],
    },
  },
  typescript: {
    typeCheck: {
      eslint: {
        files: './**/*.{ts,js,vue}',
      },
    },
  },
}

export default config
