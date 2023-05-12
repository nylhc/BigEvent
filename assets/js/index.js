$(function () {
  window.getUserInfo = getUserInfo
  window.getImg = getImg

  function getImg () {
    return $('.userinfo img').attr('src')
  }

  function getUserInfo () {
    $.ajax({
      type: "GET",
      url: "/my/userinfo",
      // headers: {
      //   Authorization: localStorage.getItem('token') || ''
      // },
      success: function ({ status, message: msg, data }) {
        if (status !== 0) return layui.layer.msg(msg)
        console.log(data)
        renderAvatar(data)
      },
      // complete (res) {
      //   console.log(res);
      //   if (res.responseJSON.status === 1) {
      //     //1.清空本地存储token
      //     localStorage.removeItem('token')
      //     //2.重新跳转登录页面
      //     location.href = '/login.html'
      //   }
      // }
    });
  }
  getUserInfo()

  function renderAvatar ({ nickname: nn, username: un, user_pic: up }) {
    // 获取用户的名称
    const uname = nn || un
    $('#welcome').html('欢迎&nbsp;&nbsp;' + uname)

    if (up) {
      // 渲染图片头像
      $('.layui-nav-img').attr('src', up).show()
      $('.text-avatar').hide()
    } else {
      // 渲染文本头像
      $('.layui-nav-img').hide()
      const letter = uname[0].toUpperCase()
      $('.text-avatar').html(letter).show()
    }
    $('.userinfo').show()
  }

  // 退出登录
  $('#btnLogout').on('click', function () {
    layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
      //1.清空本地存储token
      localStorage.removeItem('token')
      //2.重新跳转登录页面
      location.href = '/login.html'
      layer.close(index);
    })
  })
})