var express = require('express')
var path = require('path')
var router = require('./router')
var bodyParser = require('body-parser')
var session = require('express-session')

var app = express()

// 开放public，node_modules文件夹
// path.join 拼接路径:避免手动拼错的问题
// path.join(__dirname, './public/')将相对路径改为绝对路径
app.use('/public/', express.static(path.join(__dirname, './public/')))
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))

app.engine('html', require('express-art-template'))
app.set('views', path.join(__dirname, './views/')) // 默认就是 ./views 目录

// 配置模板引擎和 body-parser 一定要在 app.use(router) 挂载路由之前 ??? TODO
// 配置解析表单POST请求体插件 body-parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// 配置session
app.use(session({
  // secret:配置加密字符串，自定义加盐，在md5加密基础上和这个字符串拼接去加密
  //  增加安全性，防止客户端恶意伪造
  secret: 'her',
  resave: false,
  // saveUninitialized true:无论是否使用session,默认也分配cookie
  saveUninitialized: true
}))

// 将router挂载到app中
app.use(router)

app.listen(5000, function() {
  console.log('blog is running in port 5000..')
})
