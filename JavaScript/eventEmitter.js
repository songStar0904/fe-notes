class EventEmitter {
  constructor() {
    this._events = {}
  }
  isValidListener(listener) {
    if (typeof listener === 'function') {
      return true
    } else if (listener && typeof listener === 'object') {
      return this.isValidListener(listener.listener)
    } else {
      false
    }
  }
  indexOf(arr, item) {
    let result = -1
    item = typeof item === 'object' ? item.listener : item
    for (let i = 0, len = arr.length; i < len; i++) {
      // null 占位了
      if (arr[i] && arr[i].listener === item) {
        result = i
        break
      }
    }
    return result
  }
  $on(event, listener) {
    if (!event || ! listener) return 
    if (!this.isValidListener(listener)) {
      return new Error('listener is must a function')
    }
    let listeners = this._events[event] = this._events[event] || []
    let listenerIsWrap = typeof listener === 'object'
    if (this.indexOf(listeners, listener) === -1) {
      listeners.push(listenerIsWrap ? listener : {
        listener,
        once: false
      })
    }
    return this
  }
  $once(event, listener) {
    this.$on(event, {
      listener,
      once: true
    })
    return this
  }
  $emit(event, args = []) {
    let listeners = this._events[event]
    if (!listeners) return
    for (let i = 0, len = listeners.length; i < len; i++) {
      let listener = listeners[i]
      if (listener) {
        listener.listener.apply(this, args)
        if (listener.once) {
          this.$off(event, listener.listener)
        }
      }
    }
    return this
  }
  $off(event, listener) {
    let listeners = this._events[event]
    if (!listeners) return
    let index = this.indexOf(listeners, listener)

    if (index !== -1) {
      listeners.splice(index, 1, null) // 必须要占位 不然会影响后面的emit
    }
    return this
  }
  $allOff(event) {
    if (event && this._events[event]) {
      this._events[event] = []
    } else if (!event) {
      this._events = {}
    } else {
      return new Error(`not fond [${evnet}] evnet in evnets`)
    }
  }
}