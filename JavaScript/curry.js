const curry = (fn, ...args) => {
  if (fn.length > args.length) {
    return (...arguments) => curry(fn, ...args, ...arguments)
  } else {
    return fn(...args)
  }
}

let add = (a, b, c) => a + b + c

curry(add, 1)(2)(3)


var foo = function(...args) { 
  // 要求实现函数体
  const target = (...arg1s) => foo(...args, ...arg1s)
  target.getValue = () => {
    return args.reduce((pre,cur) => pre + cur, 0)
  }
  return target
}
var f1 = foo(1,2,3); f1.getValue(); // 6 输出是参数的和
var f2 = foo(1)(2,3); f2.getValue(); // 6
var f3 = foo(1)(2)(3)(4); f3.getValue(); // 10