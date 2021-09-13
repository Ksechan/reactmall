const express = require('express')
const app = express()
const port = 5000
const mongoose = require('mongoose')
const config = require('./config/key')
const cookieParser = require('cookie-parser')

const { User } = require('./models/User')

// body-parser가 express 버전 4.16이상부터는 express내부에 포함된다. 
// 따로 body-parser를 다운받지않고 const express = require('express') 후에 아래 두줄처럼 사용하면 됨
app.use(express.urlencoded({ extended: true }))
// ↑ application/x-www-form-urlencoded 이렇게 되어있는 데이터를 가져와서 분석해줌
app.use(express.json())
// ↑ application/json 이렇게 되어있는 데이터를 가져와서 분석해줌
app.use(cookieParser())

mongoose.connect((config.mongoURI), {})
  .then(() => { console.log('MongoDB Conneted...') })
  .catch(err => console.log(err))



app.get('/', (req, res) => {
  res.send('Hello World')
})


app.post('/register', (req, res) => {

  // 회원가입할때 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터베이스에 넣어준다

  // req.body 는
  // {
  //  id: "1",
  //  password: "123456"
  //} 이런 json파일로 들어있음

  const user = new User(req.body)

  user.save((err, userInfo) => {
    //저장할때 에러가 있다고 하면(성공하지못했다고하면) client에 에러가 있다고 json형식으로 전달해줌
    if (err) return res.json({ success: false, err })
    return res.status(200).json({
      success:true
    }) // res.status(200)은 성공했다는 뜻 -> 성공했으면 json형식으로 전달해라.
  })
})

  app.post('/login', (req, res) => {
    //요청된 이메일을 데이터베이스에서 있는지 찾는다
    //요청된 이메일이 데이터베이스에 있다면 비밀번호가 일치하는지 확인
    //비밀번호가 일치하다면 token 생성

    //findOne은 mongoDB method
    User.findOne({ email: req.body.email }, (err, user) => {
      if (!user) {
        return res.json({
          loginSuccess: false,
          message: "제공된 이메일에 해당하는 유저가 없습니다."
        })
      }

      user.comparePassword(req.body.password, (err, isMatch) => {
        if (!isMatch)
        return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다.", }) //loginSuccess false는 로그인 실패
        
        
        user.generateToken((err, user) => {
          if (err) return res.status(400).send(err); //status(400)이면 에러가 있다는것
          
          // token을 저장한다 어디에? 쿠키, 로컬스토리지 
          res.cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id })
        })
      })
    })
  })


app.listen(port, () => {
  console.log(`current port: ${port}` )
})


