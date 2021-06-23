/**
 * --- 测试用例 ---
 *
 * 输入：[1, 34, 5, 76, 8, 6, 9, 7, 6, 3]
 * 输出：[1, 3, 5, 6, 6, 7, 8, 9, 34, 76]
 *
 * --- 说明 ---
 * 
 * 思考：快速排序是稳定的吗？
 * 解答：base 的每次选择，会导致快排是不稳定排序。
 */

const quickSort = (nums) => {
  let len = nums.length
  if (len < 2) {
    return nums
  } else {
    var left = []
    var right = []
    var pivot = Math.floor(len / 2) // 向下取整
    var base = nums.splice(pivot, 1)[0] // 原数组nums少了一个
    for (let i = 0; i < len - 1; i++) {
      let tem = nums[i]
      if (tem < base) {
        left.push(tem)
      } else {
        right.push(tem)
      }
    }
  }
  return [...quickSort(left), base, ...quickSort(right)]
}

/**
 * --- 测试用例 ---
 *
 * 输入：[5, 2, 4, 7, 9, 8, 3, 6, 3, 8, 3]
 * 输出：[2, 3, 3, 3, 4, 5, 6, 7, 8, 8, 9]
 *
 * --- 说明 ---
 * 
 * 思考：冒泡排序是稳定的吗？
 * 解答：稳定。相等的元素不发生交换
 */
const bubbleSort = (nums) => {
  let len = nums.length
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - i; j++) {
      if (nums[j] > nums[j + 1]) {
        let tem = nums[j]
        nums[j] = nums[j + 1]
        nums[j + 1] = tem
      }
    }
  }
  return nums
}

/**
 * 合并排序
 */

const mergeSort = (nums) => {
  const merge = (l, r) => {
    let res = [], n1 = l.length, n2 = r.length, i = 0, j = 0
    while(i < n1 && j < n2) {
      if (l[i] <= r[j]) {
        res.push(l[i])
        i++
      } else {
        res.push(r[j])
        j++
      }
    }
    return res.concat(l.slice(i)).concat(r.slice(j))
  }
  let n = nums.length
  if (n < 2) return nums
  let mid = Math.floor(n / 2)
  let left = nums.slice(0, mid), right = nums.slice(mid)
  return merge(mergeSort(left), mergeSort(right))
}

mergeSort([5, 2, 4, 7, 9, 8, 3, 6, 3, 8, 3])

/**
 * --- 测试用例 ---
 *
 * 输入：[6, 45, 3, 2, 5, 6, 8, 4, 3, 4, 56, 67, 5]
 * 输出：[2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 45, 56, 67]
 *
 * --- 说明 ---
 * 
 * 思考：选择排序是稳定的吗？
 * 解答：要看代码是如何实现的，在本例中由于有交换，所以是不稳定排序。
 */

const selectSort = (nums) => {
  let n = nums.length
  let min = Infinity, tem, flag
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      if (min > nums[j]) {
        min = nums[j]
        flag = j
      }
    }
    tem = nums[i]
    nums[i] = min
    nums[flag] = tem
    min = Infinity
  }
  return nums
}
selectSort([6, 45, 3, 2, 5, 6, 8, 4, 3, 4, 56, 67, 5])

/**
 * --- 题目描述 ---
 * 
 * 实现一个函数，可以对 url 中的 query 部分做拆解，返回一个 key: value 形式的 object  
 * 
 * --- 实例 ---
 * 
 * 输入：'http://sample.com/?a=1&e&b=2&c=xx&d#hash' 
 * 输出：{a: 1, b: 2, c: 'xx', d: ''}  
 */
 function getQueryObj(url) {
  // TODO
  let arr = url.split('?')[1].split('#')[0].split('&');
  const res = {};
  arr.forEach(e => {
      const [key, value] = e.split('=');
      if (!value) {
          res[key] = '';
      } else {
          res[key] = value;
      }
  })
  return res;
}

function getQueryObj(url) {
  let res = {}
  let reg = /([^?&=]+)=([^?&=]*)/g // 除?&= + 1次或多次 * 0次或多次
  url.replace(reg, (rs, $1, $2) => {
    console.log(rs, $1, $2)
    res[decodeURIComponent($1)] = decodeURIComponent($2)
  })
  return res
}