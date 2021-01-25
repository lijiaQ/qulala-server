const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const router = require('./router/index')

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type,Accept,X-Requested-With,Authorization'
  )
  res.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS')
  if (req.method.toLowerCase() == 'options') {
    res.sendStatus(200)
  } else {
    next()
  }
})

app.use('/', express.static('./public/'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/api', router)

app.listen(2021, () => {
  console.log('running in http://localhost:2021')
})
