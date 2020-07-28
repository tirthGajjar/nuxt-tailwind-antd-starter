import path from 'path'
import { NuxtConfig } from '@nuxt/types'
import TerserPlugin from 'terser-webpack-plugin'

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
      {
        name: 'msapplication-TileColor',
        content: '#da532c',
      },
      {
        name: 'theme-color',
        content: '#1A64E2',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/favicon.ico' },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'mask-icon',
        href: '/safari-pinned-tab.svg',
        color: '#5bbad5',
      },
    ],
  },
  render: {
    bundleRenderer: {
      shouldPrefetch: (_file, type) => {
        // if (type === 'script') {
        //   if (/yourPageNameHere/.test(file)) {
        //     return false
        //   }
        // }
        if (type === 'style') {
          return true
        }
        return true
      },
      shouldPreload: (_file, type) =>
        ['script', 'style', 'font'].includes(type),
    },
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
    // Doc: https://pwa.nuxtjs.org
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
  loading: {
    color: '#1A64E2',
  },
  build: {
    extractCSS: true,
    parallel: true,
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
    postcss: {
      plugins: {
        cssnano: {
          preset: [
            'default',
            {
              discardComments: {
                removeAll: true,
              },
            },
          ],
        },
      },
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
        modifyVars: {
          'primary-color': '#1A64E2',
        },
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
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: false,
        }),
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
