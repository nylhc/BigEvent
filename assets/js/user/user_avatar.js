$(function () {
  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }

  // 1.3 创建裁剪区域
  $image.cropper(options)


  $('#btnChooseImage').on('click', function () {
    $('#file').click()
  })

  // 为文件选择框绑定 change 事件
  $('#file').on('change', function (e) {
    // console.log(e);
    const file = e.target.files
    console.log(file);
    if (file.length === 0) return layui.layer.msg('请上传头像')
    const imgUrl = URL.createObjectURL(file[0])
    $image.cropper('destroy').attr('src', imgUrl).cropper(options)
  })

  $('#upload').on('click', function () {
    const dataURL = $image
      .cropper('getCroppedCanvas', {
        // 创建一个 Canvas 画布
        width: 100,
        height: 100
      }).toDataURL('image/png')

    $.ajax({
      method: 'POST',
      url: '/my/update/avatar',
      data: {
        avatar: dataURL
      },
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更换头像失败！')
        }
        layer.msg('更换头像成功！')
        window.parent.getUserInfo()
      }
    })
  });

  $image.cropper('destroy').attr('src', window.parent.getImg()).cropper(options)
})