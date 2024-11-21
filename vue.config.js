const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,

  publicPath: process.env.NODE_ENV === 'production' ? '/my-project/' : '/',

  outputDir: 'dist',

  assetsDir: 'static',

  productionSourceMap: false,

  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    }
  },

  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = 'My Vue App'
      return args
    })
  },

  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  },

  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
