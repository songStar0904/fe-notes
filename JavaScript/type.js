// 1. 类型判断
function type(val) {
  Object.prototype.toString.call(val).match(/\s+(\w+)/)[1]
}

type(new Set()) // Set

// 2. 手写Number.isNaN ps: window.isNaN对字符串等都为true
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
