# 浅拷贝与深拷贝

关于浅拷贝与深拷贝，这其根本是原因是数据类型的存储方式不同，由于引用类型存储在堆中，在js中对引用类型进行赋值时，是将是将**拷贝对象的内存地址给到目标对象**。如果其中一个对象改变了，会影响到另一个对象。这个时候我们就要用到**深拷贝**来解决这个问题。

### 有哪些是浅拷贝

- `Object.assign(target, ...sources)`

`object.assign` 是 `ES6` 中 `object` 的一个方法，该方法可以用于 `JS` 对象的合并等多个用途，其中一个用途就是可以进行浅拷贝。

```js
let target = {}
let source = {
  a: {
    b: 1
  }
}
Object.assign(target, source)
console.log(target) // {a: {b: 1}}
source.a.b = 2
console.log(source) // {a: {b: 2}}
console.log(target) // {a: {b: 2}}
```
使用`Object.assign`需要注意的几点：
- 不会拷贝对象的继承属性
- 不会拷贝对象的不可枚举属性
- 可以拷贝`Symbol`类型属性

```js
let target = {}
let source = {
  sym: Symbol(1)
}
Object.defineProperty(source, 'innumerable', {
  value: '不可枚举属性',
  enumerable: false
})
Object.assign(target, source)
console.log(source) // {sym: Symbol(1), innumerable: "不可枚举属性"}
console.log(target) // {sym: Symbol(1)}
```

- 扩展运算符方式`...`

```js
let source = {
  a:{
    b: 1
  }
}
let target = {
  ...source
}
console.log(target) // {a: {b: 1}}
source.a.b = 2
console.log(source) // {a: {b: 2}}
console.log(target) // {a: {b: 2}}

let arr = [1, 2, 3]
let newArr = [...arr] // 跟arr.slice()是一样的效果
```

- `concat` 拷贝数组
数组的 `concat` 方法其实也是浅拷贝，所以连接一个含有引用类型的数组时，需要注意修改原数组中的元素的属性，因为它会影响拷贝之后连接的数组。`concat` 只能用于数组的浅拷贝，使用场景比较局限。
```js
let arr = [1, 2, 3]
let newArr = arr.concat()
newArr[1] = 100
console.log(arr, newArr) // [1, 2, 3], [1, 100, 3]
```

- `slice` 拷贝数组
`slice` 方法也比较有局限性，因为它仅仅针对数组类型。`slice` 方法会返回一个新的数组对象，这一对象由该方法的前两个参数来决定原数组截取的开始和结束下标，是不会影响和改变原始数组的。

```js
let arr = [1, 2, {val: 3}]
let newArr = arr.slice()
newArr[2].val = 100
console.log(arr) // [1, 2, {val: 100}]
```

**如何手动实现一个浅拷贝**

1. 对基础类型做一个最基本的一个拷贝
2. 对引用类型开辟一个新的存储，并且拷贝一层对象属性

```js
function shallowClone(target) {
  if (typeof target === 'object' && target !== null) {
    const cloneTarget = Array.isArray(target) ? [] : {}
    for (let prop in target) {
      if (target.hasOwnProperty(prop)) {
        cloneTarget[prop] = target[prop]
      }
    }
    return cloneTarget
  } else {
    return target
  }
}
```

### 深拷贝的原理和实现

将一个对象从内存中完整地拷贝出来一份给目标对象，并从堆内存中开辟一个全新的空间存放新对象，且新对象的修改并不会改变原对象，二者实现真正的分离。

- JSON.stringify

```js
let source = {
  a: {
    b: 1
  }
}
let target = JSON.parse(JSON.stringify)
console.log(target) // {a: {b: 1}}
source.a.b = 2
console.log(source) // {a: {b: 1}}
console.log(target) // {a: {b: 2}}
```

缺点：
1. 拷贝的对象的值中如果有函数、undefined、symbol 这几种类型，经过 JSON.stringify 序列化之后的字符串中这个键值对会消失；
2. 拷贝 Date 引用类型会变成字符串；
3. 无法拷贝不可枚举的属性；
4. 无法拷贝对象的原型链；
5. 拷贝 RegExp 引用类型会变成空对象；
6. 对象中含有 NaN、Infinity 以及 -Infinity，JSON 序列化的结果会变成 null；
7. 无法拷贝对象的循环应用，即对象成环 (obj[key] = obj)。

- 递归实现

```js
function deepClone(target, hash = new WeakMap()) {
  if (typeof target === 'object' && target !== null) {
    // 日期
    if (target instanceof Date) return new Date(target)
    // 正则
    if (target instanceof RegExp) return new RegExp(target)
    // 循环引用
    if (hash.has(target)) return hash.get(target)
    // 继承原型链
    let allDesc = Object.getOwnPropertyDescriptors(target)
    // 遍历传入参数所有键的特性
    let cloneTarget = Object.create(Object.getPrototypeOf(target), allDesc)
    hash.set(target, cloneTarget)
    for (let prop of Reflect.ownKeys(target)) {
      cloneTarget[prop] = typeof target[prop] === 'object' ? deepClone(target[prop], hash) : target[prop]
    }
    return cloneTarget
  } else {
    return target
  }
}
```