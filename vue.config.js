const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  outputDir: 'dist',
  assetsDir: 'static',
  productionSourceMap: false,
  configureWebpack: {
    devtool: 'source-map',
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    },
    plugins: [
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: JSON.stringify(true),
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false)
      })
    ]
  },
  chainWebpack: config => {
    config.plugin('provide').use(webpack.ProvidePlugin, [
      {
        'window.Quill': 'quill'
      }
    ])
  },
  css: {},
  devServer: {
    port: process.env.VUE_APP_PORT,
    proxy: {
      [process.env.VUE_APP_BASE_URL]: {
        target: process.env.VUE_APP_API_BASE_URL,
        changeOrigin: true,
        pathRewrite: {
          [`^${process.env.VUE_APP_BASE_URL}`]: ''
        }
      }
    },
    client: {
      overlay: false
    }
  }
})
