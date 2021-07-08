// 自定义vue配置
const path = require('path')
const assetsDir = 'staticweb'
// const version = require('./package.json').version
const resolve = (dir) => path.join(__dirname, dir)
const CompressionPlugin = require('compression-webpack-plugin')
const ThemeColorReplacer = require('webpack-theme-color-replacer')
const forElementUI = require('webpack-theme-color-replacer/forElementUI')
module.exports = {
  // 基本路径
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  // 输出文件目录
  outputDir: 'dist',
  assetsDir: assetsDir,
  indexPath: 'main.html',
  // eslint-loader 是否在保存的时候检查
  lintOnSave: process.env.NODE_ENV !== 'production',
  productionSourceMap: false,

  devServer: {
    // 端口
    port: 8000,
    // 热更新
    hot: true,
    // 编译压缩
    compress: true,

    // 配置代理
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: 'http://localhost:8080',
        ws: true,
        changeOrigin: true,
      },
    },
  },
  chainWebpack: (config) => {
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')

    config.resolve.alias.set('@', resolve('src'))
    /* 添加分析工具 */
    if (process.env.NODE_ENV === 'production') {
      if (process.env.npm_config_report) {
        config
          .plugin('webpack-bundle-analyzer')
          .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
          .end()
        config.plugins.delete('prefetch')
      }
    }
    config.optimization.splitChunks({
      chunks: 'all',
      cacheGroups: {
        libs: {
          name: 'chunk-libs',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial',
        },
        elementUI: {
          name: 'chunk-elementUI',
          priority: 20,
          test: /[\\/]node_modules[\\/]_?element-ui(.*)/,
        },
        commons: {
          name: 'chunk-commons',
          test: resolve('src/components'),
          minChunks: 1,
          priority: 10,
          reuseExistingChunk: true,
        },
      },
    })
    // config
    //   .plugin('ScriptExtHtmlWebpackPlugin')
    //   .after('html')
    //   .use('script-ext-html-webpack-plugin', [
    //     {
    //       inline: /runtime\..*\.js$/
    //     }
    //   ])
    //   .end()
    config.optimization.runtimeChunk('single')
  },
  configureWebpack: (config) => {
    let plugins = []
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      config.mode = 'production'
      plugins.push(
        new CompressionPlugin({
          test: /\.js$|\.html$|\.css/, // 匹配文件名
          threshold: 10240, // 对超过10k的数据进行压缩
          deleteOriginalAssets: false, // 是否删除原文件
        })
      )
    }
    plugins.push(
      new ThemeColorReplacer({
        fileName: `css/theme-colors.[contenthash:8].css`,
        matchColors: [...forElementUI.getElementUISeries('#5582f3')],
        changeSelector: forElementUI.changeSelector,
        // isJsUgly: config.isBuild,
      })
    )
    return {
      plugins,
    }
  },
}
