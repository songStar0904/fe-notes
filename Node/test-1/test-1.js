/**
 * 找出一个目录下文件名为aaa.txt且其内容包含“bbb”字符串的文件，目录中包含子目录，找出所有符合条件的文件
 */

const fs = require('fs')

const path = require('path')

function readFileList(dir, fileList = []) {
  const files = fs.readdirSync(dir)
  // console.log(files)
  files.forEach((item) => {
    let fullPath = path.resolve(dir, item)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      readFileList(fullPath, fileList)
    } else {
      const value = fs.readFileSync(fullPath, 'utf-8')
      // console.log(value)
      if (value.indexOf('bbb') !== -1 && item === 'aaa.txt') {
        fileList.push(item)
      }
    }
  })
  return fileList
}
let fileList = readFileList(__dirname)
console.log(fileList)
