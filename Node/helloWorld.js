const http = require('http')
const fs = require('fs')
const path = require('path')
const hostname = '127.0.0.1'
const port = 3000
console.log(__dirname)
const server = http.createServer((req, res) => {
  fs.readFile(path.join(__dirname, './index.html'), (err, data) => {
    if (err) {
      res.writeHead(404, {
        'content-type': 'text/html;charset="utf-8"',
      })
      res.write('<h1>404错误</h1><p>您要找的页面不存在</p>')
      res.end()
    } else {
      res.writeHead(200, {
        'content-type': 'text/html;charset="utf-8"',
        'cache-control': 'max-age=31536000',
      })
      res.write(data)
      res.end()
    }
  })
})

server.listen(port, hostname, () => {
  console.log(`服务器运行在 http://${hostname}:${port}/`)
})
