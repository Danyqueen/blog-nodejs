// 大型项目里用routes文件夹按照业务功能划分
var express = require('express')
// 数据库：user表单数据schema
var User = require('./models/user')

// md5加密
var md5 = require('blueimp-md5')

var router = express.Router()

router.get('/', function(req, res) {
  console.log(req.session.user)
  res.render('index.html', {
    user: req.session.user
  })
})

router.get('/login', function(req, res) {
  res.render('login.html')
})

router.post('/login', function(req, res) {
  var body = req.body
  console.log(body)
  // 关于findOne ??? TODO
  User.findOne({
    email: body.email,
    password: md5(md5(body.password))
  }, function (err, user){
    if (err) {
      return res.status(500).json({
        err_code: 500,
        message: err.message
      })
    }

    if (!user) {
       return res.status(200).json({
         err_code: 1,
         message: 'Email or password is invalid.'
       })
    }
    // 如果邮箱密码都正确，user则有值，先处理错误，后面再处理正确情况
    // 登录成功，通过session记录登录状态
    req.session.user = user
    res.status(200).json({
      err_code: 0,
      message: 'OK'
    })
  })
})

router.get('/register', function (req, res) {
  res.render('register.html')
})

router.post('/register', function (req, res) {
  console.log(req.body)
  // 1.获取表单提交的数据
  //   已引入body-parse，因此可直接用req.body拿到数据
  var body = req.body
  // 2.操作数据库，判断该用户是否存在
  //   已存在：不允许注册
  //   不存在：允许注册
  //   findOne()  $or :其中任一成立
  try {
    User.findOne({
      $or: [
        {
          email: body.email
        },
        {
          nickname: body.nickname
        }
      ]
    }, function (err, data) { 
      // 如何将回调换成 async...await ??? TODO  
      // 3.发送响应
      if (err) {
        // return res.status(500).send('Sever error')
        // send只能传字符串      
        /* send输出对象时，转成json格式字符串
          return res.status(200).send(JSON.stringify({
            success: true
          }))
        */
        // express 提供了一个响应方法，接收一个对象为参数，会自动把对象转成字符串再发给浏览器
        // json可以传对象自动会转换成字符串发给浏览器
        return res.status(500).json({
          err_code: 500,
          message: 'Server Error'
        })
      }
      if (data) {
        // 邮箱或昵称已存在
        return res.status(200).json({
          err_code: 1,
          message: 'Email or nickname already exists'
        })
        // 同步提交时如下处理
        // return res.render('register.html', {
        //   err_message: '邮箱或密码已存在',
        //   form: body
        // })
      }
  
      body.password = md5(md5(body.password))
  
      // 存储在数据库中
      new User(body).save(function(err, user) {
        if (err) {
          return res.status(500).json({
            err_code: 500,
            message: 'Sever Error'
          })
        }

        // 注册成功，使用session记录用户的登录状态
        req.session.user = user 
        // 持久化存储session ??? TODO
        
        return res.status(200).json({
          err_code: 0,
          message: 'OK'
        })
      })
    })
  } catch (err) {
    return res.status(500).json({
      err_code: 500,
      message: err.message
    })
  }
})

router.get('/logout', function (req, res) {
  // 1.清除登录状态：session
  req.session.user = null
  // 2.重定向到登录页
  //   由于是a链接退出，是同步请求，此时可以直接在服务端重定向
  res.redirect('/login')
})

router.get('/topic/show/:id', function (req, res) {
  res.render('topic/show.html', {
    user: req.session.user
  })
})

router.get('/topic/new', function (req, res) {
  res.render('topic/new.html', {
    user: req.session.user
  })
})
module.exports = router