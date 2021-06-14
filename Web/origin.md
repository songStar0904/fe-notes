# 同源

[浏览器的同源策略](https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy)

## 同源策略

同源策略是一种约定，它是浏览器最核心也最基本的安全功能，如果缺少了同源策略，浏览器很容易受到 XSS、CSRF 等攻击。所谓同源是指"协议+域名+端口"三者相同，即便两个不同的域名指向同一个 ip 地址，也非同源。

| URL                                               | 结果 | 原因                              |
| ------------------------------------------------- | ---- | --------------------------------- |
| `http://store.company.com/dir2/other.html`        | 同源 | 只有路径不同                      |
| `http://store.company.com/dir/inner/another.html` | 同源 | 只有路径不同                      |
| `https://store.company.com/secure.html`           | 失败 | 协议不同                          |
| `http://store.company.com:81/dir/etc.html`        | 失败 | 端口不同 ( http:// 默认端口是 80) |
| `http://news.company.com/dir/other.html`          | 失败 | 主机不同                          |

### 同源策略限制的内容

- Cookie、LocalStorage、IndexedDB 等存储性内容
- DOM 节点
- AJAX 请求发送后，结果被浏览器拦截了

### 有三个标签是允许跨域加载资源

- `<img src=XXX>`
- `<link href=XXX>`
- `<script src=XXX>`

## 解决方案

### jsonp

利用 `<script>` 标签没有跨域限制的漏洞，网页可以得到从其他来源动态产生的 JSON 数据。JSONP 请求一定需要对方的服务器做支持才可以。

JSONP 优点是简单兼容性好，可用于解决主流浏览器的跨域数据访问的问题。

缺点是仅支持 get 方法具有局限性,不安全可能会遭受 XSS 攻击。

```js
function jsonp({ url, params, callback }) {
  return new Promise((resolve, reject) => {
    let script = document.createElement('script')
    window[callback] = function (data) {
      resolve(data)
      document.body.removeChild(script)
    }
    params = { ...params, callback } // a=1&callback=show
    let arr = []
    for (let key in params) {
      arr.push(`${key}=${params[key]}`)
    }
    script.url = `${url}?${arr.join('&')}`
    document.body.appendChild(script)
  })
}
jsonp({
  url: 'localhost:3000',
  params: {
    a: 1,
  },
  callback: 'show',
}).then((res) => {
  console.log(res)
})
```

## CORS

CORS 需要浏览器和后端同时支持。IE 8 和 9 需要通过 XDomainRequest 来实现。

- Access-Control-Allow-Origin

服务端设置 Access-Control-Allow-Origin 就可以开启 CORS。 该属性表示哪些域名可以访问资源，如果设置通配符则表示所有网站都可以访问资源。

- Access-Control-Request-Method

`Access-Control-Request-Method:GET,PUT,POST,PATCH,DELETE,OPTIONS`头部字段用于预检请求。其作用是，将实际请求所使用的 HTTP 方法告诉服务器。

- Access-Control-Allow-Headers

`Access-Control-Allow-Headers`头部字段用于预检请求。其作用是，将实际请求所携带的首部字段告诉服务器。

- Access-Control-Expose-Headers

跨域请求中，浏览器默认情况下通过 API 只能获取到以下响应头部字段：

```cors
Cache-Control
Content-Language
Content-Type
Expires
Last-Modified
Pragma
```

如果想要访问其他响应头部信息，则需要在服务器端设置 Access-Control-Allow-Headers。

Access-Control-Expose-Headers 让服务器把允许浏览器访问的头部字段放入白名单，比如：

`Access-Control-Expose-Headers: X-My-Custom-Header, X-Another-Custom-Header`

复制代码这样浏览器就能够访问到 X-My-Custom-Header 和 X-Another-Custom-Header 响应头部了。

- Access-Control-Max-Age

Access-Control-Max-Age 字段指定了预检请求的结果能够被缓存多久，单位是 秒

- Access-Control-Allow-Credentials

XMLHttpRequest.withCredentials （或者 Request.credentials）表示跨域请求中，user agent 是否应该发送 cookies、authorization headers 或者 TLS client certificates 等凭据。

Access-Control-Allow-Credentials 的作用就是：当 credentials 为 “真” 时（XHR 和 Fetch 设置方式不一样），Access-Control-Allow-Credentials 告诉浏览器是否把响应内容暴露给前端 JS 代码。

## postMessage

postMessage()方法允许来自不同源的脚本采用异步方式进行有限的通信，可以实现跨文本档、多窗口、跨域消息传递。

`otherWindow.postMessage(message, targetOrigin, [transfer]);`

### 使用场景

- 页面和其打开的新窗口的数据传递
- 多窗口之间消息传递
- 页面与嵌套的 iframe 消息传递
- 上面三个场景的跨域数据传递

## 代理

步骤：

- 接受客户端请求 。
- 将请求 转发给服务器。
- 拿到服务器 响应 数据。
- 将 响应 转发给客户端。

### node 中间件代理（vue-cli proxy）

实现原理：同源策略是浏览器需要遵循的标准，而如果是服务器向服务器请求就无需遵循同源策略。

### nginx 反向代理

实现原理类似于 Node 中间件代理，需要你搭建一个中转 nginx 服务器，用于转发请求。

### 抓包工具的代理（如 Fiddler 等）

## WebSocket

WebSocket 和 HTTP 都是应用层协议，都基于 TCP 协议。但是 WebSocket 是一种双向通信协议，在建立连接之后，WebSocket 的 server 与 client 都能主动向对方发送或接收数据。

## document.domain

该方式只能用于二级域名相同的情况下，比如 a.test.com 和 b.test.com 适用于该方式。因为`document.domain`只能改变域名，无法对协议和端口号进行操作。

只需要给页面添加 document.domain ='test.com' 表示二级域名都相同就可以实现跨域。

实现原理：两个页面都通过 js 强制设置 document.domain 为基础主域，就实现了同域。
