const mongoose = require('mongoose')

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

  token: String,

  tokenExp: {
    //token의 유효기간
    type: Number
  }
})

// Schema를 model로 감싸준다.
const User = mongoose.model('User', userSchema)

module.exports = { User }
