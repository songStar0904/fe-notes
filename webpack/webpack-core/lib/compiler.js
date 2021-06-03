const path = require('path')
const fs = require('fs')

const { getAST, getDependencies, transform } = require('./parser')

module.exports = class Compiler {
  // 相关配置
  constructor(options) {
    let { entry, output } = options
    this.entry = entry
    this.output = output
    this.modules = []
  }
  // 开始编译
  run() {
    const entryModule = this.buildModule(this.entry, true)
    this.modules.push(entryModule)
    // 遍历递归所有依赖项
    this.modules.map((module) => {
      module.dependencies.map((dependency) => {
        this.modules.push(this.buildModule(dependency))
      })
    })
    console.log(this.modules)
    this.emitFiles()
  }
  /**
   * 构建模块
   * @param {String} filename 文件名
   * @param {Boolean} isEntry 是否入口文件
   */
  buildModule(filename, isEntry) {
    let ast
    if (isEntry) {
      ast = getAST(filename)
    } else {
      const absolutePath = path.join(process.cwd(), './src', filename)
      ast = getAST(absolutePath)
    }

    return {
      filename, // 文件名称
      dependencies: getDependencies(ast), // 依赖列表
      transformCode: transform(ast), // 转化后的代码
    }
  }
  // 输出文件
  emitFiles() {
    const outputPath = path.join(this.output.path, this.output.filename)
    let modules = ''
    this.modules.map((module) => {
      modules += `'${module.filename}' : function(require, module, exports) {${module.transformCode}},`
    })
    const bundle = `
        (function(modules) {
          function require(fileName) {
            const fn = modules[fileName];
            const module = { exports:{}};
            fn(require, module, module.exports)
            return module.exports
          }
          require('${this.entry}')
        })({${modules}})
    `
    // 把文件内容写入文件系统
    fs.writeFileSync(outputPath, bundle, 'utf-8')
  }
}
