'use strict'
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    open: true,
    port: 8100,
    overlay: {
      warnings: true,
      errors: true
    },
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    resolve: {
      alias: {
        '@': resolve('src'),
        'images': resolve('src/assets/images'),
      }
    }
  },
  // sass-loader
  // https://vue-loader.vuejs.org/zh/guide/pre-processors.html#sass
  css: {
    loaderOptions: {
      sass: {
        // webpack.docschina.org/loaders/sass-loader/#options
        // webpack.docschina.org/loaders/sass-loader/#additionaldata
        // cli.vuejs.org/guide/css.html#passing-options-to-pre-processor-loaders
        additionalData: `
          @import "~@/assets/styles/variables.scss";
        `
      }
    }
  }
}
