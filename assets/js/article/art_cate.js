$(function () {
  initArtCateList()

  // 获取文章分类的列表
  let loadIndex = layer.load(0);
  function initArtCateList () {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        layer.close(loadIndex)
        console.log('获取文章分类列表', res);
        const htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
      }
    })
  }

  // 为添加类别按钮绑定点击事件
  let addIndex = null
  $('#btnAddCate').on('click', function () {
    addIndex = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#dialog-add').html(),
      shadeClose: true, // 点击遮罩区域，关闭弹层
    })
  })

  // 提交添加分类表单
  // 通过代理的形式，为 form-add 表单绑定 submit 事件
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault()
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('新增分类失败！')
        }
        initArtCateList()
        layer.msg('新增分类成功！')
        // 根据索引，关闭对应的弹出层
        layer.close(addIndex)
      }
    })
  })

  // 点击修改,打开弹窗并回填数据
  let editIndex = null
  $('tbody').on('click', '.btnEditCate', function () {
    // 弹出一个修改文章分类信息的层
    editIndex = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '修改文章分类',
      content: $('#dialog-edit').html(),
      shadeClose: true, // 点击遮罩区域，关闭弹层
    })

    const id = $(this).attr('data-id')
    // 发起请求获取对应分类的数据
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: function (res) {
        if (res.status !== 0) return layer.msg(res.message)
        layui.form.val('form-edit', res.data)
      }
    })
  })

  // 提交修改分类表单
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault()
    $.ajax({
      type: "POST",
      url: "/my/article/updatecate",
      data: $(this).serialize(),
      success: function ({ status, message }) {
        layer.msg(message)
        if (status !== 0) return
        initArtCateList()
        layer.close(editIndex)
      }
    });
  });


  $('tbody').on('click', '.btnDelCate', function () {
    const id = $(this).attr('data-id')
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        type: "GET",
        url: '/my/article/deletecate/' + id,
        success: function ({ status, message }) {
          layer.msg(message)
          if (status !== 0) return
          initArtCateList()
          layer.close(index)
        }
      });
    })
  });
})