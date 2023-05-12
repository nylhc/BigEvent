$(function () {
  initUserInfo()
  // 初始化用户的基本信息
  function initUserInfo () {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        console.log(res)
        // 数据回填
        layui.form.val('formUserInfo', res.data)
      }
    })
  }

  layui.form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return '昵称长度必须在 1 ~ 6 个字符之间！'
      }
    }
  })

  $('#EditForm').on('submit', function (e) {
    e.preventDefault()
    // console.log('------------' + this);
    const qs = $('#EditForm').serialize()
    $.ajax({
      type: "POST",
      url: "/my/userinfo",
      data: qs,
      success: function ({ status, message }) {
        layer.msg(message)
        if (status !== 0) return

        window.parent.getUserInfo()
      }
    });
  });


  // 重置表单的数据
  $('#btnReset').on('click', function (e) {
    // 阻止表单的默认重置行为
    e.preventDefault()
    initUserInfo()
  })
})