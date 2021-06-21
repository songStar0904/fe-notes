# uniapp实现

基于 **编译器+运行时** 配合实现

## 编译器

Vue文件 生成 js json wxml wxss

## 运行时

![](https://awps-assets.meituan.net/mit-x/blog-images-bundle-2018a/c09f839d.jpg)

Vue.js 视图层渲染由 render 方法完成，同时在内存中维护着一份虚拟 DOM，mpvue 无需使用 Vue.js 完成视图层渲染，因此我们改造了 render 方法，禁止视图层渲染。熟悉源代码的读者，都知道 Vue runtime 有多个平台的实现，除了我们常见的 Web 平台，还有 Weex。从现在开始，我们增加了新的平台 mpvue。

生命周期关联：生命周期和数据同步是 mpvue 框架的灵魂，Vue.js 和小程序的数据彼此隔离，各自有不同的更新机制。mpvue 从生命周期和事件回调函数切入，在 Vue.js 触发数据更新时实现数据同步。小程序通过视图层呈现给用户、通过事件响应用户交互，Vue.js 在后台维护着数据变更和逻辑。可以看到，数据更新发端于小程序，处理自 Vue.js，Vue.js 数据变更后再同步到小程序。为实现数据同步，mpvue 修改了 Vue.js runtime 实现，在 Vue.js 的生命周期中增加了更新小程序数据的逻辑。

事件代理机制：用户交互触发的数据更新通过事件代理机制完成。在 Vue.js 代码中，事件响应函数对应到组件的 method， Vue.js 自动维护了上下文环境。然而在小程序中并没有类似的机制，又因为 Vue.js 执行环境中维护着一份实时的虚拟 DOM，这与小程序的视图层完全对应，我们思考，在小程序组件节点上触发事件后，只要找到虚拟 DOM 上对应的节点，触发对应的事件不就完成了么；另一方面，Vue.js 事件响应如果触发了数据更新，其生命周期函数更新将自动触发，在此函数上同步更新小程序数据，数据同步也就实现了。

## 性能优化

- 减少调用setData频次
Vue中nextTick机制自动优化。

- 减少调用setData数据量
Vue中依赖收集，只会去更新template中使用的数据。
借鉴**westore json diff库**对长列表进行高效，差量优化
```js
// 小程序
Page({
  add(arr) {
    let list = this.data.list
    this.setData({
      list: list.push(...arr) // 这样从逻辑层传视图层是一个完整的list列表。当list有上百条数据的时候，小程序传输压力大
    })
  }
})
// uniapp
export default {
  methods: {
    add(arr) {
      this.list.push(...arr) // 会进行差量优化，只对添加的值进行传输。
    }
  }
}
```

- 自定义组件实现局部数据更新

- onPageScroll避免频繁更新，使用innerSectionObserve代替。