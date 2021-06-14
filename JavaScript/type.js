// 1. 类型判断
function type(val) {
  Object.prototype.toString.call(val).match(/\s+(\w+)/)[1]
}

type(new Set()) // Set

// 2. 手写Number.isNaN ps: window.isNaN对字符串等都为true
// 当我们向isNaN传递一个参数，它的本意是通过Number()方法尝试将这参数转换成Number类型，如果成功返回false，如果失败返回true。
// 判断传入的参数是否严格的等于NaN(也就是 ===)。
// Number.isNaN与isNaN最的区别是，Number.isNaN不存在类型转换的行为。
Number.myIsNaN = (val) => {
  return typeof val === 'number' && isNaN(val)
}
isNaN('a') // true
Number.myIsNaN('a') // false
Number.isNaN('a') // false

// 3. 手写instanceof
function myInstanceof(left, right) {
  if (typeof left !== 'object' || left === null) {
    return
  }
  let proto = left.__proto__
  let prototype = right.prototype
  while (true) {
    if (proto === prototype) return true
    if (proto === null) return false
    proto = proto.__proto__
  }
}

myInstanceof(1, Number)

// 4. 变量提升
var a = 1
function bar(a) {
  a = 2
  console.log(a) // 2
  var a = 3
  console.log(a) // 3
  function a() {} // 优先级没有var高 因为function 先执行 随后被var 替换
  console.log(a) // 3
}
bar(a)
console.log(a) // 1

Object._create = function(obj) {
  // function F() {}
  // F.prototype = obj
  // return new F()
  let o = {}
  o.__proto__ = obj
  return o
}