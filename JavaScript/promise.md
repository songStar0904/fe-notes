## 宏任务与微任务

[从一道让我失眠的 Promise 面试题开始，深入分析 Promise 实现细节](https://juejin.cn/post/6945319439772434469)

宏任务是由宿主（浏览器、Node）发起的，而微任务由 JS 自身发起。

| 宏任务（Macrotask）            | 微任务（Microtask）             |
| ------------------------------ | ------------------------------- |
| setTimeout                     | requestAnimationFrame（有争议） |
| setInterval                    | MutationObserver（浏览器环境）  |
| MessageChannel                 | Promise.[ then/catch/finally ]  |
| I/O，事件队列 process.nextTick | （Node 环境）                   |
| setImmediate（Node 环境）      | queueMicrotask                  |
| script（整体代码块）           |                                 |

### 如何理解 script（整体代码块）是个宏任务呢

实际上如果同时存在两个 script 代码块，会首先在执行第一个 script 代码块中的同步代码，如果这个过程中创建了微任务并进入了微任务队列，第一个 script 同步代码执行完之后，会首先去清空微任务队列，再去开启第二个 script 代码块的执行。所以这里应该就可以理解 script（整体代码块）为什么会是宏任务。

### EventLoop

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2baaf009636748c491898aafeceddb32~tplv-k3u1fbpfcp-watermark.image)

### 实现`Promsie`

```js
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
class MyPromise {
  status = PENDING
  value = null
  reason = null
  // 存储成功回调函数
  onFulfilledCallbacks = []
  // 存储失败回调函数
  onRejectedCallbacks = []
  constructor(executor) {
    // executor 是一个执行器，进入会立即执行
    // 并传入resolve和reject方法
    try {
      executor(this.resolve, this.reject)
    } catch (error) {
      // 如果有错误，就直接执行 reject
      this.reject(error)
    }
  }
  resolve = (value) => {
    if (this.status === PENDING) {
      this.status = FULFILLED
      this.value = value
      // resolve里面将所有成功的回调拿出来执行
      while (this.onFulfilledCallbacks.length) {
        // Array.shift() 取出数组第一个元素，然后（）调用，shift不是纯函数，取出后，数组将失去该元素，直到数组为空
        this.onFulfilledCallbacks.shift()(value)
      }
    }
  }
  reject = (reason) => {
    if (this.status === PENDING) {
      this.status = REJECTED
      this.reason = reason
      while (this.onRejectedCallbacks.length) {
        this.onRejectedCallbacks.shift()(reason)
      }
    }
  }
  then(onFulfilled, onRejected) {
    // 如果不传，就使用默认函数
    onFulfilled =
      typeof onFulfilled === 'function' ? onFulfilled : (value) => value
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (reason) => {
            throw reason
          }
    const promise2 = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        // 创建一个微任务等待 promise2 完成初始化
        queueMicrotask(() => {
          try {
            const x = onFulfilled(this.value)
            // 传入 resolvePromise 集中处理
            this.resolvePromise(promise2, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      } else if (this.status === REJECTED) {
        queueMicrotask(() => {
          try {
            const x = onRejected(this.reason)
            this.resolvePromise(promise2, x, resovle, reject)
          } catch (error) {
            reject(error)
          }
        })
      } else if (this.status === PENDING) {
        // 因为不知道后面状态的变化情况，所以将成功回调和失败回调存储起来
        // 等到执行成功失败函数的时候再传递
        this.onFulfilledCallbacks.push(() => {
          queueMicrotask(() => {
            try {
              const x = onFulfilled(this.value)
              this.resolvePromise(promise2, x, resolve, reject)
            } catch (error) {
              reject(error)
            }
          })
        })
        this.onRejectedCallbacks.push(() => {
          queueMicrotask(() => {
            try {
              const x = onRejected(this.reason)
              this.resolvePromise(promise2, x, resolve, reject)
            } catch (error) {
              reject(error)
            }
          })
        })
      }
    })
    return promise2
  }
  resolvePromise(promise2, x, resolve, reject) {
    // 如果相等了，说明return的是自己，抛出类型错误并返回
    if (promise2 === x) {
      return reject(
        new TypeError('Chaining cycle detected for promise #<Promise>')
      )
    }
    // 判断x是不是 MyPromise 实例对象
    if (x instanceof this.constructor) {
      // 执行 x，调用 then 方法，目的是将其状态变为 fulfilled 或者 rejected
      // x.then(value => resolve(value), reason => reject(reason))
      // 简化之后
      x.then(resolve, reject)
    } else {
      // 普通值
      resolve(x)
    }
  }
  // resolve 静态方法
  static resolve(parameter) {
    // 如果传入 MyPromise 就直接返回
    if (parameter instanceof MyPromise) {
      return parameter
    }

    // 转成常规方式
    return new MyPromise((resolve) => {
      resolve(parameter)
    })
  }

  // reject 静态方法
  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason)
    })
  }
}
```

```js
Promise.all = function (promises) {
  return new Promise((resolve, reject) => {
    promises = Array.from(promises)
    if (promises.length === 0) {
      resolve([])
    } else {
      let result = []
      let index = 0
      for (let i = 0; i < promises.length; i++) {
        Promise.resolve(promises[i]).then(
          (data) => {
            result[i] = data
            if (++index === promises.length) {
              resolve(result)
            }
          },
          (err) => {
            reject(err)
            return
          }
        )
      }
    }
  })
}
```
