var mongoose = require('mongoose')

// 连接数据库
// 连接后要开mongod
mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});

var Schema = mongoose.Schema

var userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  nickname: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  create_time: {
    type: Date,
    default: Date.now
  },
  last_modified_time: {
    type: Date,
    default: Date.now
  },
  avater: {
    type: String,
    default: '/public/img/avater-default.png'
  },
  bio: {// 简介
    type: String,
    default: ''
  },
  gender: {// enum枚举：多个可选值，-1：保密
    type: Number,
    enum: [-1, 0, 1],
    default: -1
  },
  birthday: {
    type: Date
  },
  status: {
    type: Number,
    // 0没有权限设置，1不可以评论，2不可以登录使用
    enum: [1,2],
    default: 0
  }
})

module.exports = mongoose.model('User', userSchema)