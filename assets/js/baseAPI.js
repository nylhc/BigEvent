$.ajaxPrefilter(function (options) {
  //拼接Ajax请求根路径
  options.url = 'http://big-event-api-t.itheima.net' + options.url

  // 统一为有权限的接口，设置 headers 请求头
  if (options.url.includes('/my/')) {
    options.headers = {
      Authorization: localStorage.getItem('token') || ''
    }
  }

  options.complete = function complete (res) {
    // console.log(res);
    if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
      //1.清空本地存储token
      localStorage.removeItem('token')
      //2.重新跳转登录页面
      location.href = '/login.html'
    }
  }
})