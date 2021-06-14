/**XMLHttpRequest
 * 1. 页面当中的事件或者函数出发Ajax请求的时候，建立XMLHttpRequest对象，以进行接下来的Ajax请求。
 * 2. 调用XMLHttpRequest的open函数
 * 3. XMLHttpRequest向服务器发送请求
 * 4. 服务器处理请求后，会把相应返回到网页，此时，XMLHttpRequest监听到这个相应，并执行响应代码。
 */
function myAjax(
  url,
  options = {
    method: 'GET',
  }
) {
  return new Promise((resolve, reject) => {
    var xhttp
    if (window.XMLHttpRequest) {
      xhttp = new XMLHttpRequest()
    } else {
      // IE
      xhttp = new ActiveXObject('Microsoft.XMLHTTP')
    }
    xhttp.open(options.method, url)
    xhttp.send(options?.data)
    xhttp.onreadystatechange = function () {
      if (xhttp.readyState === 4) {
        // 0：UNSENT：代理被创建，但尚未调用open()方法
        // 1：OPENED：open() 方法已经被调用
        // 2：HEADERS_RECEIVED：send() 方法已经被调用，并且头部和状态已经可获得
        // 3：LOADING：下载中； responseText 属性已经包含部分数据
        // 4：DONE：下载操作已完成
        if (xhttp.status == 200) {
          resolve(xhttp.responseText)
        } else {
          reject(xhttp.responseText)
        }
      }
    }
  })
}
