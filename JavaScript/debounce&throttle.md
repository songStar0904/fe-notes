### [防抖与节流](https://q.shanyue.tech/fe/js/3.html#防抖-debounce)[JavaScript 专题之跟着 underscore 学防抖](https://github.com/mqyqingfeng/Blog/issues/22)[JavaScript 专题之跟着 underscore 学节流](https://github.com/mqyqingfeng/Blog/issues/26)

## 防抖`debounce`

防抖，顾名思义，防止抖动，以免把一次事件误认为多次，敲键盘就是一个每天都会接触到的防抖操作。

### 使用场景

- 登录，发短信，抢购，支付等按钮避免用户点击太快，以至于发送多次请求。
- 调整浏览器窗口大小，resize 次数过于频繁，造成计算过多。
- 文本编辑器实时保存，当无任何更改操作一秒后进行保存。

### 实现 **防抖重在清零(`clearTimeout`)**

```js
function debounce(fn, wait) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn(...args)
    }, wait)
  }
}
```

## 节流 `throttle`

节流，顾名思义，控制水的流量。控制事件发生的频率，如控制为 1s 发生一次，甚至 1 分钟发生一次。与服务端(server)及网关(gateway)控制的限流 (Rate Limit) 类似。

### 使用场景

- `scroll`事件，每隔一秒计算一次位置信息等
- 浏览器播放事件，每隔一秒计算一次进度信息等

### 实现 节流重在枷锁（`time = timeout`）

```js
function throttle(fn, wait) {
  let timer
  return (...args) => {
    if (timer) return
    timer = setTimeout(() => {
      fn(...args)
      timer = null
    }, wait)
  }
}
```
