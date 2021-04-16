/**  new
 * 1. 创建一个对象
 * 2. 把对象隐式原型赋值给构造函数prototype
 * 3. 执行构造函数
 * 4. 返回一个对象（如果构造函数返回对象则返回构造函数的对象，否则返回返回new创建的对象）
*/

function myNew(fn, ...args) {
  if (typeof fn !== 'function') {
    throw 'fn must be a function'
  }
  let obj = {}
  obj.__proto__ = fn.prototype
  let res = fn.call(obj, ...args)
  if (typeof res === 'object' && res !== null) {
    return res
  } else {
    return obj
  }
}

/** call
 * fn.call(context, arg1, arg2, ...)
*/

Function.prototype.myCall = function(context = window, ...args) {
  let fn = this
  context.fn = fn
  let res = context.fn(...args)
  delete context.fn
  return res
}

/**apply
 * fn.apply(context, [arg1, arg2, ...])
 */
Function.prototype.myApply = function(context = window, args) {
  let fn = this
  context.fn = fn
  let res = context.fn(...args)
  delete context.fn
  return res
}

/**
 * bind
 * let bindFn = fn.bind(context， arg1, ...)
 * bindFn(arg, ...)
 * 1. 改变了fn的this指向，让this指向了context，返回一个函数
 * 2. 可以在bind的时候开始给fn传递参数
 * 3. 调用bindFn在传递剩下的参数
 * 4. bind()函数回创建一个新绑定的函数（bound function）绑定函数也可以使用new运算符构造，提供的this值会被武略，但迁至参数仍会提供给模拟函数
 */
Function.prototype.myBind = function(context, ...args) {
  debugger
  let fn = this
  if (typeof fn !== 'function') {
    throw new Error('fn must be a function')
  }
  let fBound = function() {
    return fn.apply(this instanceof fn ? this : context, [...args, ...arguments])
  }
  if (fn.prototype) {
    fBound.prototype = Object.create(fn.prototype)
  }
  return fBound
}

var obj = {
  name: 'obj'
}
var fn = function(arg1, arg2) {
  this.fn = 'fn'
  console.log(this.name, this.fn, arg1, arg2)
}
var objFn = fn.myBind(obj, 'arg1')
var newObj = new objFn('arg2')
console.log(newObj)