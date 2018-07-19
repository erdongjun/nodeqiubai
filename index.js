const Koa = require('koa')
// 读取本地文件
const fs = require('fs')
// 路径
const path = require('path')
// 路由中间件
const Router = require('koa-router')
// 解析url参数
const bodyParser = require('koa-bodyparser')
// 静态资源中间件
const static = require('koa-static')
// 模版
const views = require('koa-views')

const app = new Koa()
// log
const loggerAsync  = require('./middleware/logger-async')
// 资源上传
const { uploadFile } = require('./util/upload')
// mysql
const {query} = require('./util/async-db')

// 静态资源目录对于相对入口文件index.js的路径
const staticPath = './static'

app.use(loggerAsync())
app.use(static(
  path.join( __dirname,  staticPath)
))

app.use(bodyParser())
// 加载模板引擎
app.use(views(path.join(__dirname, './view'), {
  extension: 'ejs'
}))


// 测试
const server = async ( ctx, next ) => {
  let result = {
    success: true,
    data: null
  }

  if ( ctx.method === 'GET' ) { 
    if ( ctx.url === '/getString.json' ) {
      result.data = 'this is string data'
    } else if ( ctx.url === '/getNumber.json' ) {
      result.data = 123456
    } else {
      result.success = false
    }
    ctx.body = result
    next && next()
  } else if ( ctx.method === 'POST' ) {
    if ( ctx.url === '/postData.json' ) {
      result.data = 'ok'
    } else {
      result.success = false
    }
    ctx.body = result
    next && next()
  } else {
    ctx.body = 'hello world'
    next && next()
  }
}

app.use(server)
module.exports = app

// 执行sql脚本对数据库进行读写 

// async function selectAllData( ) {
//   let sql = 'SELECT * FROM user'
//   let dataList = await query( sql )
//   return dataList
// }

// async function getData() {
//   let dataList = await selectAllData()
//   console.log( dataList )
// }

// getData()


// app.use( async ( ctx ) => {
//   // console.log(ctx)
//   ctx.body =  ctx.request.url
// })
// app.use( async ( ctx ) => {
//   let title = 'hello koa2'
//   await ctx.render('index', {
//     title,
//   })
// })

// app.use( async ( ctx ) => {

//   if ( ctx.url === '/' && ctx.method === 'GET' ) {
//     // 当GET请求时候返回表单页面
//     let html = `
//       <h1>koa2 upload demo</h1>
//       <form method="POST" action="/upload.json" enctype="multipart/form-data">
//         <p>file upload</p>
//         <span>picName:</span><input name="picName" type="text" /><br/>
//         <input name="file" type="file" /><br/><br/>
//         <button type="submit">submit</button>
//       </form>
//     `
//     ctx.body = html

//   } else if ( ctx.url === '/upload.json' && ctx.method === 'POST' ) {
//     // 上传文件请求处理
//     let result = { success: false }
//     let serverFilePath = path.join( __dirname, 'upload-files' )

//     // 上传文件事件
//     result = await uploadFile( ctx, {
//       fileType: 'album', // common or album
//       path: serverFilePath
//     })

//     ctx.body = result
//   } else {
//     // 其他请求显示404
//     ctx.body = '<h1>404！！！ o(╯□╰)o</h1>'
//   }
// })

app.listen(3000)
console.log('[demo] start-quick is starting at port 3000')