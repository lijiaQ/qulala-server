const fs = require('fs')
const uuid = require('node-uuid')

// 增删改查
module.exports = class Model {
  constructor(dataPath) {
    this.dataPath = dataPath
  }
  // 查找所有符合条件的
  find(filter) {
    return new Promise((resolve, reject) => {
      fs.readFile(this.dataPath, (err, data) => {
        if (err) {
          reject(err)
        } else {
          const result = JSON.parse(data).filter(item =>
            this.isSame(filter, item)
          )
          resolve(result)
        }
      })
    })
  }
  // 查找一个符合条件的
  findOne(filter) {
    return new Promise((resolve, reject) => {
      fs.readFile(this.dataPath, (err, data) => {
        if (err) {
          reject(err)
        } else {
          const result = JSON.parse(data)

          const index = result.findIndex(item => this.isSame(filter, item))
          console.log(filter)

          resolve(result[index])
        }
      })
    })
  }
  // 新增一位
  create(item) {
    return new Promise((resolve, reject) => {
      fs.readFile(this.dataPath, (err1, data1) => {
        if (err1) {
          reject(err1)
        } else {
          const result = JSON.parse(data1)
          const newStudent = { ...item, id: uuid.v1() }
          result.unshift(newStudent)
          fs.writeFile(this.dataPath, JSON.stringify(result), err2 => {
            if (err2) {
              reject(err2)
            } else {
              resolve(newStudent)
            }
          })
        }
      })
    })
  }
  // 删除符合条件的第一位
  deleteOne(filter) {
    return new Promise((resolve, reject) => {
      fs.readFile(this.dataPath, (err1, data) => {
        if (err1) {
          reject(err1)
        } else {
          const result = JSON.parse(data)
          const index = result.findIndex(item => this.isSame(filter, item))
          if (index === -1) {
            resolve(null)
          } else {
            const temp = result.splice(index, 1)
            fs.writeFile(this.dataPath, JSON.stringify(result), err2 => {
              if (err2) {
                reject(err2)
              } else {
                resolve(temp)
              }
            })
          }
        }
      })
    })
  }
  // 修改一位
  updateOne(filter, obj) {
    return new Promise((resolve, reject) => {
      fs.readFile(this.dataPath, (err1, data) => {
        if (err1) {
          reject(err1)
        } else {
          const result = JSON.parse(data)
          const index = result.findIndex(item => this.isSame(filter, item))
          if (index === -1) {
            resolve(null)
          } else {
            const temp = Object.assign(result[index], obj)
            fs.writeFile(this.dataPath, JSON.stringify(result), err2 => {
              if (err2) {
                reject(err2)
              } else {
                resolve(temp)
              }
            })
          }
        }
      })
    })
  }
  // 判断是否符合过滤规则
  isSame(obj1, obj2) {
    for (let key in obj1) {
      if (obj2[key] && obj2[key] != obj1[key]) {
        return false
      }
    }
    return true
  }
}
