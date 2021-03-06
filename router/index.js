const express = require('express')
const axios = require('axios')
const formidable = require('formidable')
const Model = require('../utils/model')
const userModel = new Model('./data/user.json')
const carModel = new Model('./data/cars-info.json')
const orderModel = new Model('./data/order.json')
const router = express.Router()

// 登录
router.post('/login', async (req, res) => {
  try {
    const { username, telephone, password } = req.body
    console.log(username, telephone, password)
    const user = await userModel.findOne({ username, telephone, password })
    console.log(user)
    if (user) {
      res.status(200).json({
        code: 0,
        data: {
          id: user.id,
          username: user.username,
          telephone: user.telephone,
          avatar: user.avatar,
          gender: user.gender
        },
        msg: '登录成功'
      })
    } else {
      res.status(200).json({
        code: 1,
        msg: '用户名或密码错误'
      })
    }
  } catch {
    res.status(500).json({
      code: 1,
      msg: '服务器错误'
    })
  }
})

// 注册
router.post('/register', async (req, res) => {
  try {
    const { username, telephone, password } = req.body
    const user = await userModel.findOne({ username, telephone })
    if (user) {
      return res.status(200).json({
        code: 1,
        msg: '用户名或电话重复'
      })
    }
    const newUser = await userModel.create({
      username,
      telephone,
      password,
      gender: 1,
      avatar: '/avatar/default_avatar.png'
    })
    res.status(200).json({
      code: 0,
      data: {
        id: user.id,
        username: newUser.username,
        telephone: newUser.telephone,
        avatar: newUser.avatar,
        gender: newUser.gender
      },
      msg: '登录成功'
    })
  } catch {
    res.status(500).json({
      code: 1,
      msg: '服务器错误'
    })
  }
})

// 上传头像
// 返回一个新头像的地址，所以需要再调用修改用户信息的接口完成修改头像
router.post('/avatar', (req, res) => {
  const form = new formidable.IncomingForm()
  form.uploadDir = './public/avatar'
  form.keepExtensions = true
  form.parse(req)
  form.on('file', async (name, file) => {
    fileSplit = file.path.split('\\')
    res.status(200).json({
      code: 0,
      data: {
        avatar:
          'http://localhost:2021/avatar/' + fileSplit[fileSplit.length - 1]
      }
    })
  })
})

// 修改用户信息
router.post('/user/update', async (req, res) => {
  try {
    /*
    id: 用户id
    info: 新信息 比如:
      {
        name: '灵儿',
        password: 123
      }
    */
    const { id, info } = req.body
    const user = await userModel.updateOne(id, {...info})
    res.status(200).json({
      code: 0,
      data: user
    })
  } catch {
    res.status(500).json({
      code: 1,
      msg: '服务器错误'
    })
  }
})

// 车型
router.get('/cars', async (req, res) => {
  try {
    const carsList = await carModel.find({})
    res.status(200).json({
      code: 0,
      data: carsList
    })
  } catch {
    res.status(500).json({
      code: 1,
      msg: '服务器错误'
    })
  }
})

// 创建订单
router.post('/order', async (req, res) => {
  try {
    const { user, other, time, note, car, address } = req.body
    await orderModel.create({
      user,
      other,
      time,
      note,
      car,
      address,
      // 0 进行中，1 已完成， -1 已取消
      status: 0,
      // 司机
      claim: null
    })
    res.status(200).json({
      code: 0,
      msg: '添加成功'
    })
  } catch {
    res.status(500).json({
      code: 1,
      msg: '服务器错误'
    })
  }
})

// 获取订单
router.get('/order', async (req, res) => {
  try {
    const ordering = await orderModel.find({})
    res.status(200).json({
      code: 0,
      data: {
        ordering: ordering,
        ordered: [],
        canceled: []
      }
    })
  } catch {
    res.status(500).json({
      code: 1,
      msg: '服务器错误'
    })
  }
})

// 根据经纬返回位置信息
router.get('/address', async (req, res) => {
  const { loc } = req.query
  axios
    .get(
      `https://apis.map.qq.com/ws/geocoder/v1/?location=${loc}&key=AP2BZ-CXLLG-U3YQ5-I756Q-4HQXE-C7FIZ`
    )
    .then(result => {
      res.status(200).json({
        code: 0,
        data: result.data.result
      })
    })
})

module.exports = router
