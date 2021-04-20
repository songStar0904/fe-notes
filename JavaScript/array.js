// map
Array.prototype.myMap = function (cb, context = window) {
  if (typeof cb === 'function') {
    return Error('callback is must be function')
  }
  let arr = this
  let res = []
  for (let i = 0; i < arr.length; i++) {
    res[i] = cb.call(context, arr[i], i, arr)
  }
  return res
}

// filter
Array.prototype.myFilter = function (cb, context = window) {
  if (typeof cb === 'function') {
    return Error('callback is must be function')
  }
  let arr = this
  let res = []
  for (let i = 0; i < arr.length; i++) {
    if (cb.call(context, arr[i], i, arr)) {
      res.push(arr[i])
    }
  }
  return res
}

// every
Array.prototype.myEvery = function (cb, context = window) {
  if (typeof cb === 'function') {
    return Error('callback is must be function')
  }
  let arr = this
  let res = true
  for (let i = 0; i < arr.length; i++) {
    if (!cb.call(context, arr[i], i, arr)) {
      res = false
      break
    }
  }
  return res
}

// some
Array.prototype.mySome = function (cb, context = window) {
  if (typeof cb === 'function') {
    return Error('callback is must be function')
  }
  let arr = this
  let res = false
  for (let i = 0; i < arr.length; i++) {
    if (cb.call(context, arr[i], i, arr)) {
      res = true
      break
    }
  }
  return res
}

// reduce
Array.prototype.myReduce = function (cb, initValue = []) {
  if (typeof cb === 'function') {
    return Error('callback is must be function')
  }
  let arr = this
  let res = initValue
  for (let i = 0; i < arr.length; i++) {
    res = cb.call(context, res, arr[i], i, arr)
  }
  return res
}

// find context 默认undefined 是es6 严格模式？
Array.prototype.myFind = function (cb, context = undefined) {
  if (typeof cb === 'function') {
    return Error('callback is must be function')
  }
  let arr = this
  let res = undefined
  for (let i; i < arr.length; i++) {
    if (cb.call(context, arr[i], i, arr)) {
      res = arr[i] // findIndex res = i
      break
    }
  }
  return res
}

// flat
Array.prototype.myFlat = function () {
  let arr = this
  let res = []
  if (!Array.isArray(arr)) return
  while (arr.length) {
    let value = arr.shift()
    Array.isArray(value) ? arr.push(...value) : res.push(value)
  }
  return res
}
Array.prototype.myFlat = function (num = 1) {
  let arr = this
  let res = []
  if (Array.isArray(arr)) {
    res = arr.reduce((pre, cur) => {
      console.log(num)
      return pre.concat(Array.isArray(cur) && num > 1 ? cur.myFlat(--num) : cur) // num > 1 reduce 本身就遍历了一层
    }, [])
  }
  return res
}
arr = [1, [2, [3]]]
arr.myFlat(2)
