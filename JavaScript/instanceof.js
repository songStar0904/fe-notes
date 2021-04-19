function myInstanceof(left, right) {
  let proto = left.__proto__
  let prototype = right.prototype
  while(proto === null) {
    if (proto === prototype) {
      return true
    }
    proto = proto.__proto__
  }
  return false
}