const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');


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

userSchema.pre('save', function( next ){
  var user = this;
  
  if(user.isModified('password')){
    bcrypt.genSalt(saltRounds, function (err, salt){
      if(err) return next(err)
  
      bcrypt.hash(user.password, salt, function(err, hash) {
        if(err) return next(err)
        user.password = hash
        next()
      })
    })
  } else {
      next()
  }
})

userSchema.methods.comparePassword = function(plainPassword, cb){

  bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
    if(err) return cb(err);
      cb(null, isMatch)

  })

}

userSchema.methods.generateToken = function(cb) {
  var user = this;
  
  // jsonwebtoken을 이용해서 token 생성

  var token = jwt.sign(user._id.toHexString(), 'secretToken')

  user.token = token
  user.save(function(err, user) {
    if(err) return cb(err)
    cb(null, user)
  })
}

userSchema.statics.findByToken = function(token, cb){
  var user = this;

  jwt.verify(token, 'secretToken', function(err, decoded){
    // 유저 아이디를 이용해서 유저를 찾은 다음에
    // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

    user.findOne({"_id" : decoded, "token" : token}, function(err,user){
      if(err) return cb(err);
      cb(null, user)
    })

  })
}

const User = mongoose.model('User', userSchema)

module.exports = { User }
