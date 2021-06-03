[嗨，你真的懂 this 吗？](https://juejin.cn/post/6844903805587619854)

this 就是一个指针，指向调用函数的对象。

### 默认绑定

默认绑定，在不能应用其它绑定规则时使用的默认规则，通常是独立函数调用。

```js
function sayName() {
  console.log(this.name)
}
var name = 'fn'
sayName() // fn
```

- 非严格模式 this 指向 windows（全局对象）
- 严格模式 this 指向 undefined

### 隐式绑定

函数的调用是在某个对象上触发的，即调用位置上存在上下文对象。

```js
function sayName() {
  console.log(this.name)
}
var obj1 = {
  name: 'obj1',
  obj2: obj2,
}
var obj2 = {
  name: 'obj2',
  sayName: sayName,
}
var name = 'windows'
obj1.obj2.sayName() // obj2
```

- 对象属性链中只有最后一层会影响到调用位置。

#### 隐式丢失

```js
function sayName() {
  console.log(this.name)
}
var obj = {
  name: 'obj',
  sayName: sayName,
}
var name = 'windows'
var say = obj.sayName
say() // windows
var obj2 = {
  name: 'obj2',
  sayName: function () {
    setTimeout(function () {
      console.log(this.name)
    })
  },
}
obj2.sayName() // windows
setTimeout(obj.sayName) // windows
// setTimeout(fn, delay) {fn()} 相当于 fn = obj.sayName
```

### 显示绑定

显式绑定比较好理解，就是通过 call,apply,bind 的方式，显式的指定 this 所指向的对象。

```js
function sayName() {
  console.log(this.name)
}
var obj = {
  name: 'obj',
}
var name = 'windows'
sayName.call(obj) // obj
```

那么，使用了硬绑定，是不是意味着不会出现隐式绑定所遇到的绑定丢失呢？显然不是这样的，不信，继续往下看。

```js
function sayName() {
  console.log(this.name)
}
var obj = {
  name: 'obj',
  sayName: sayName,
}
var name = 'windows'
var say = function (fn) {
  fn()
}
say.call(obj, obj.sayName) // windows
```

现在，我们希望绑定不会丢失，要怎么做？很简单，调用 fn 的时候，也给它硬绑定。

```js
function sayName() {
  console.log(this.name)
}
var obj = {
  name: 'obj',
  sayName: sayName,
}
var name = 'windows'
var say = function (fn) {
  fn.call(this)
}
say.call(obj, obj.sayName) // obj
```

### new 绑定

使用 new 来调用函数的时候，就会新对象绑定到这个函数的 this 上。

```js
function sayName(name) {
  this.name = name
}
var say = new sayName('new')
say.name // new
```

### 优先级

new 绑定 > 显式绑定 > 隐式绑定 > 默认绑定

### 绑定例外

如果我们将 null 或者是 undefined 作为 this 的绑定对象传入 call、apply 或者是 bind,这些值在调用时会被忽略，实际应用的是默认绑定规则。

```js
function sayName() {
  console.log(this.name)
}
var obj = {
  name: 'obj',
}
var name = 'windows'
sayName.call(null) // windows
```

### 箭头函数

- 函数体内的 this 对象，继承的是外层代码块的 this
- 不可以当做构造函数，也就是说不能用 new，否则报错
- 不可以使用 arguments 对象，该对象在函数体内不存在。可用`...`代替
- 不可以使用 yield 命令，因此箭头函数不能用作 Generator 函数。
- 箭头函数没有自己的 this，所以不能用 call()、apply()、bind()这些方法去改变 this 的指向
