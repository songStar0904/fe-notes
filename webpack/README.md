# webpack

## 插件

### compression-webpack-plugin 打包压缩

```js
const CompressionPlugin = require('compression-webpack-plugin')
new CompressionPlugin({
  test: /\.js$|\.html$|\.css/, // 匹配文件名
  threshold: 10240, // 对超过10k的数据进行压缩
  deleteOriginalAssets: false, // 是否删除原文件
})
```

### splitChunks 代码切割

[Webpack 大法之 Code Splitting](https://zhuanlan.zhihu.com/p/26710831)

```js
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
```

### webpack-bundle-analyzer 打包分析

```js
/* 添加分析工具 */
if (process.env.NODE_ENV === 'production') {
  if (process.env.npm_config_report) {
    config
      .plugin('webpack-bundle-analyzer')
      .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
      .end()
  }
}
```
