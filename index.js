const express = require('express')
const app = express()
const port = 5000
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://sechan:Aaa1149427!@sechan.oflru.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {})
  .then(() => { console.log('MongoDB Conneted...') })
  .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(port, () => {
  console.log(`current port: ${port}` )
})


