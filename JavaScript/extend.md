# 继承

继承是面向对象的，使用这种方式我们可以更好地复用以前的开发代码，缩短开发的周期、提升开发效率。

### 继承的几种方式

- 原型链继承
```js
function Parent() {
  this.name = 'parent'
  this.age = 20
  this.play = [1, 2, 3]
}
function Child() {
  this.name = 'child'
}
Child.prototype = new Parent()

let s1 = new Child()
let s2 = new Child()
s1.play.push(4)
console.log(s1.play, s2.play) // [1, 2, 3, 4] [1, 2, 3, 4]
s1.__proto__.age = 100
console.log(s1.age, s2.age) // 100,100
```
因为两个实例使用的是同一个原型对象。它们的内存空间是共享的，当一个发生变化的时候，另外一个也随之进行了变化，这就是使用原型链继承方式的一个缺点。

- 构造函数继承（借助call）

```js
function Parent() {
  this.name = 'parent'
  this.play = [1, 2, 3]
}
Parent.prototype.getName = () => {
  return this.name
}
function Child() {
  Parent.call(this)
  this.name = 'child'
}

let s1 = new Child()
let s2 = new Child()
s1.play.push(4)
console.log(s1.play, s2.play) // // [1, 2, 3, 4] [1, 2, 3]
console.log(s1.getName()) // getName is not a function
```
这样写的时候子类虽然能够拿到父类的属性值，解决了第一种继承方式的弊端，但问题是，父类原型对象中一旦存在父类之前自己定义的方法，那么子类将无法继承这些方法。

- 组合继承（前两种组合）

```js
function Parent() {
  this.name = 'parent'
  this.play = [1, 2, 3]
}
Parent.prototype.getName = function() {
  return this.name
}
function Child() {
  // 第二次调用 Parent()
  Parent.call(this)
}
// 第一次调用 Parent()
Child.prototype = new Parent()
// 手动挂上构造器，指向自己的构造器
Child.prototype.constructor = Child

let s1 = new Child()
let s2 = new Child()

s1.play.push(4)
console.log(s1.play, s2.play) // [1, 2, 3, 4] [1, 2, 3]
console.log(s1.getName()) // parent
```
新问题：通过注释我们可以看到 `Parent` 执行了两次，第一次是改变`Child` 的 `prototype` 的时候，第二次是通过 `call` 方法调用 `Parent` 的时候，那么 `Parent` 多构造一次就多进行了一次性能开销，这是我们不愿看到的。

- 原型式继承
这里不得不提到的就是 ES5 里面的 Object.create 方法，这个方法接收两个参数：一是用作新对象原型的对象、二是为新对象定义额外属性的对象（可选参数）。
```js
let parent = {
  name: 'parent',
  play: [1, 2, 3]
}
let s1 = Object.create(parent)
let s2 = Object.create(parent)
s1.name = 's1'
s1.play.push(4)

console.log(s1.name, s2.name) // s1 parent
console.log(s1.play, s2.play) // [1, 2, 3, 4] [1, 2, 3, 4]
```
play 引用数据类型共用一套存储地址，所以s1.play改变会导致s2.play改变。

- 寄生式继承
使用原型式继承可以获得一份目标对象的浅拷贝，然后利用这个浅拷贝的能力再进行增强，添加一些方法，这样的继承方式就叫作寄生式继承。
```js
let parent = {
  name: 'parent',
  play: [1, 2, 3],
  getName: function() {
    return this.name
  }
}
let child = Object.create(parent)
child.getPlay = function() {
  return this.play
}

console.log(child.getName) // parent
console.log(child.getPlay) // [1, 2, 3]
```
虽然其优缺点和原型式继承一样，但是对于普通对象的继承方式来说，寄生式继承相比于原型式继承，还是在父类基础上添加了更多的方法。

- 寄生组合式继承
```js
function clone(parent, child) {
  // 这里改用 Object.create 就可以减少组合继承中多进行一次构造的过程
  child.prototype = Object.create(parent.prototype)
  child.prototype.constructor = child
}
function Parent() {
  this.name = 'parent'
  this.play = [1, 2, 3]
}
Parent.prototype.getName = function() {
  return this.name
}
function Child() {
  Parent.call(this)
  this.name = 'child'
}
clone(Parent, Child)
Child.prototype.getPlay = function() {
  return this.play
}

let s1 = new Child()
console.log(s1)
```