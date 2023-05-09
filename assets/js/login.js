$(function () {
  //点击"去注册账号"的链接
  $('#link_reg').on('click', function () {
    $('.login-box').hide()
    $('.reg-box').show()
  })

  //点击"去登录"的链接
  $("#link_login").on('click', function () {
    $('.login-box').show()
    $('.reg-box').hide()
  })

  //从layui中获取form对象
  var form = layui.form
  //通过form.verify()函数自定义校验规则
  form.verify({
    //自定义pwd校验规则
    pwd: [
      /^[\S]{6,16}$/
      , '密码必须6到16位，且不能出现空格'
    ],
    //校验两次密码是否一致
    repwd: function (value) {
      var pwd = $('.reg-box [name=password]').val()
      if (pwd !== value) {
        return '两次密码不一致！'
      }
    }
  })

  var layer = layui.layer
  const baseURL = 'http://big-event-api-t.itheima.net'
  // 注册
  $('#form_reg').on('submit', function (e) {
    e.preventDefault()
    const qs = $('#form_reg').serialize()
    $.ajax({
      type: "POST",
      url: '/api/reguser',
      data: qs,
      success: function ({ status, message }) {
        layer.msg(message)
        // 注册失败
        if (status !== 0) return
        // 注册成功
        $('#form_reg')[0].reset()
        $("#link_login").click()
      }
    });
  });

  // 登录
  $('#form_login').on('submit', function (e) {
    e.preventDefault()
    const qs = $('#form_login').serialize()
    $.ajax({
      type: "POST",
      url: '/api/login',
      data: qs,
      success: function ({ status, message, token }) {
        layer.msg(message)
        if (status !== 0) return
        localStorage.setItem('token', token)
        location.href = '/index.html'
      }
    });
  });
})