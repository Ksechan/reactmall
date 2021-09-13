const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
// saltRounds의 10은 salt를 10자리 만들어서 비밀번호를 암호화하겠다는 뜻.
const saltRounds = 10
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50
  },
  email: {
    type: String,
    trim: true, //띄어쓰기를 없애주는 용도
    unique: 1
  },
  password: {
    type: String,
    minlength: 3
  },
  lastname: {
    type: String,
    maxlength: 50
  },
  role: {
    // role을 주는 이유는 관리자가 될 수도 있고 일반 유저가 될 수 있기때문에.
    type: Number,
    default: 0
  },

  img: String,

  token: {
    type: String
  },

  tokenExp: {
    //token의 유효기간
    type: Number
  }
})

// pre()는 mongoose에서 가져온 method
// pre('save') 하면 유저모델을 저장하기 전에! 실행
userSchema.pre('save', function (next) {
  // userSchema를 가리킴
  let user = this;
  // 비밀번호를 변경하는 경우를 제외하고 사용자 이름이나 이메일을 변경하는 경우에도 비밀번호를 암호화하면 안되니까(비밀번호를 변경하는 경우에만 암호화해야함)
  if (user.isModified('password')) { //password가 변경될때만!
    // 비밀번호를 암호화 시킨다.
    //function (err,salt)의 뜻 : 에러가 나면 err를 가져오고 아니면 salt를 가져온다
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err)
      //에러가 안나고 salt를 가져올때
      bcrypt.hash(user.password, salt, function (err, hash) {
        //function의 hash는 암호화된 비밀번호
        if (err) return next(err)
        //user.password에 hash(암호화된비밀번호)를 넣어줌
        user.password = hash
        //next()는 save하는걸로 보내버림
        next()
      })
    })
  } else {
    next()
  }
})

//index.js의 comparePassword랑 generateToken method를 여기서 만듦

userSchema.methods.comparePassword = function (plainPassword, cb) {
  //plainPassword   hashpassword 두개가 같은지 확인
  //확인하려면 plainPassword를 암호화해서 비교해야함
  //this는 userSchema
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err)
    cb(null, isMatch) //null은 err가 없다는 뜻, isMatch는 true
  })
}

userSchema.methods.generateToken = function (cb) {
  //jsonwebtoken을 이용해서 token을 생성하기

  var user = this;
  var token = jwt.sign(user._id.toHexString(), 'secretToken')

  // user_.id + 'secretToken' = token 이렇게 토큰을 만드는것
  // 그리고 token을 해석을 할때 'secretToken'을 넣으면 user_.id가 나오게된다

  user.token = token
  user.save((err, user) => {
    if (err) return cb(err)
    cb(null, user)
  })
}



// Schema를 model로 감싸준다.
const User = mongoose.model('User', userSchema)

module.exports = { User }
