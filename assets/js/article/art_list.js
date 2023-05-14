$(function () {
  let loadIndex = layer.load(0);

  // 定义一个查询的参数对象，将来请求数据的时候，
  // 需要将请求参数对象提交到服务器
  var q = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 10, // 每页显示几条数据，默认每页显示2条
    cate_id: '', // 文章分类的 Id
    state: '' // 文章的发布状态
  }
  initTable()
  // 获取文章列表数据的方法
  function initTable () {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        layer.close(loadIndex)
        console.log('获取文章列表', res);
        if (res.status !== 0) {
          return layer.msg(res.message)
        }
        // 使用模板引擎渲染页面的数据
        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)

        // 调用渲染分页的方法
        renderPage(res.total)
      }
    })
  }


  initCate()
  // 初始化文章分类的方法
  function initCate () {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取分类数据失败！')
        }
        // 调用模板引擎渲染分类的可选项
        var htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        // 通过 layui 重新渲染表单区域的UI结构
        layui.form.render()
      }
    })
  }

  // 筛选功能
  $('#form-search').on('submit', function (e) {
    e.preventDefault()
    // 获取表单中选中项的值
    q.cate_id = $('[name=cate_id]').val()
    q.state = $('[name=state]').val()
    // 根据最新的筛选条件，重新渲染表格的数据
    initTable()
  })

  // 定义渲染分页的方法
  function renderPage (total) {
    // 调用 laypage.render() 方法来渲染分页的结构
    layui.laypage.render({
      elem: 'pageBox', // 分页容器的 Id
      count: total, // 总数据条数
      limit: q.pagesize, // 每页显示几条数据
      curr: q.pagenum, // 设置默认被选中的分页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],// 每页展示多少条
      jump (obj, first) {
        if (first) return
        q.pagenum = obj.curr
        q.pagesize = obj.limit
        initTable()
      }
    })
  }

  // 删除文章
  $('tbody').on('click', '.btn-delete', function () {
    // 获取到文章的 id
    const id = $(this).attr('data-id')
    const len = $(this).length
    // 询问用户是否要删除数据
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除文章失败！')
          }
          layer.msg('删除文章成功！')
          if (len === 1) {
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          initTable()
        }
      })
      layer.close(index)
    })
  })


  // 定义美化时间的过滤器
  template.defaults.imports.dateFormat = function (val) {
    const date = new Date(val)

    var YYYY = date.getFullYear()
    var MM = (date.getMonth() + 1).toString().padStart(2, '0')
    var DD = date.getDate().toString().padStart(2, '0')

    var hh = date.getHours().toString().padStart(2, '0')
    var mm = date.getMinutes().toString().padStart(2, '0')
    var ss = date.getSeconds().toString().padStart(2, '0')

    return `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}`
  }
})