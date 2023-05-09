$.ajaxPrefilter(function (options) {
  //拼接Ajax请求根路径
  options.url = 'http://www.liulongbin.top:3007' + options.url
})