const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    type : String,
    maxlength: 50
  },
  email: {
    type : String,
    trim: true, // 이메일에 스페이스바가 있을경우 지워주는 역할
    unique : 1 // 이메일이 중복으로 존재하지 않도록해줌
  },
  password: {
    type: String,
    minlength: 5
  },
  lastname: {
    type : String,
    maxlength: 50
  },
  role: {
    type: Number,
    default: 0
  },
  image: String, // 감싸지않고 독립적으로 사용해도 됨
  token: {
    type: String
  },
  tokenExp: {
    type: Number
  }
})

// 스키마를 모델로 감싸줌
// User => 모델의 이름
// userSchema => 스키마 이름
const User = mongoose.model('User', userSchema)

module.exports = { User }
