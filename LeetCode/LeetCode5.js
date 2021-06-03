/**
 * LeetCode 第 5 题：最长回文子串
 * 给定一个字符串 s，找到 s 中最长的回文子串。你可以假设 s 的最大长度为 1000。
 * 示例 1：
 * 输入: "babad"
 * 输出: "bab"
 * 注意: "aba" 也是一个有效答案。
 */
// 暴力解法
function longestPalindrome(str) {
  let len = str.length
  if (len < 2) {
    return str
  }
  let maxLen = 1
  let res = str.slice(0, 1)
  for (let i = 0; i < len - 1; i++) {
    for (let j = i + 1; j < len; j++) {
      if (j - i + 1 > maxLen && vaild(str, i, j)) {
        maxLen = j - i + 1
        res = str.slice(i, j + 1)
      }
    }
  }
  return res
}

function vaild(s, i, j) {
  while (i < j) {
    if (s[i] !== s[j]) {
      return false
    }
    i++
    j--
  }
  return true
}

longestPalindrome('babad')

// 中心扩散法

function longestPalindrome(str) {
  let len = str.length
  if (len < 2) {
    return str
  }
  let maxLen = 1,
    res = str.slice(0, 1),
    maxStr,
    odd,
    even
  for (let i = 0; i < len - 1; i++) {
    odd = centerSpread(str, i, i)
    even = centerSpread(str, i, i + 1)
    maxStr = odd.length > even.length ? odd : even
    if (maxStr.length > maxLen) {
      maxLen = maxStr.length
      res = maxStr
    }
  }
  return res
}

function centerSpread(s, i, j) {
  let len = s.length
  while (i >= 0 && j < len) {
    if (s[i] === s[j]) {
      i--
      j++
    } else {
      break
    }
  }
  return s.slice(i + 1, j)
}

longestPalindrome('babad')
