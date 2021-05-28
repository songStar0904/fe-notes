## hash

所有输出的文件名带的 hash 都是一样的，只要有一个文件发生改变，那么所有的文件名上 hash 都会改变，这样使得浏览器缓存失效。

## chunkhash

chunkhash 是根据具体每一个模块文件自己的的内容包括它的依赖计算所得的 hash，所以某个文件的改动只会影响它本身的 hash，不会影响其它文件。

但是如果有个`index.js`对应一个`index.css`，因为我在 index.js 中引入了 css，所以当 css 改变的话会导致 js 引入的路径发生改变从而导致 index.js 发生改变。这时候就需要用到 contenthash

## contenthash

它的出现主要是为了解决，让 css 文件不受 js 文件的影响。比如 foo.css 被 foo.js 引用了，所以它们共用相同的 chunkhash 值。但这样子是有问题的，如果 foo.js 修改了代码，css 文件就算内容没有任何改变，由于是该模块的 hash 发生了改变，其 css 文件的 hash 也会随之改变。
这个时候我们就可以使用 contenthash 了，保证即使 css 文件所处的模块里有任何内容的改变，只要 css 文件内容不变，那么它的 hash 就不会发生变化。
contenthash 你可以简单理解为是 moduleId + content 所生成的 hash。
