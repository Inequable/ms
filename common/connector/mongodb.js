'use strict'
var MongoClient = require('mongodb').MongoClient

// var Mongodb = function(){}
// Mongodb.prototype.getMongoDB = function (callback, config) {
//     var username_password = config.username ? config.username + ':' + config.password + '@' : ''
//     var url = 'mongodb://' + username_password + config.host + ':' + (config.port ? config.port : 27017) + '/'
//     MongoClient.connect(url, { useNewUrlParser: true },  function (err, db) {
//         if (err) throw err
//         var dbo = db.db(config.db)
//         console.log("数据库已创建!")
//         callback(dbo, db)
//     })
// }

class Mongodb {
    constructor (config) {
        this.config = config
        console.log(Mongodb.instance)
        return this
        // return this.connect()
    }
    // 连接
    connect () {
        return new Promise((resolve, reject) => {
            if (Mongodb.instance) {
                // console.log('mongodb连接实例已经存在')
                resolve(Mongodb.instance)
                return
            }
            let config = this.config
            let instance, username_password, hosts = [], url, authdb, replicaset
            username_password = config.username ? config.username + ':' + config.password + '@' : ''
            if (!config.hosts) {
                hosts = ['127.0.0.1:27017']
            } else {
                for (let i = 0; i < config.hosts.length; i++) {
                    const e = config.hosts[i]
                    if (e.host && e.port) {
                        hosts.push(e.host+ ':' +e.port)
                    } else {
                        reject('主机配置有问题')
                        return
                    }
                }
            }
            authdb = config.authdb ? config.authdb : 'admin'
            replicaset = config.replicaset ? '?replicaSet=' + config.replicaset : ''
            url = 'mongodb://' + username_password + hosts.join(',') + '/'
            url += authdb + replicaset
            // https://www.runoob.com/mongodb/mongodb-connections.html 参考文献
            // url = 'mongodb://user:pass@host, host1, host2.../authdb?replicaSet=验证replica set的名称'
            MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
                if (err) {
                    console.log('mongodb连接失败')
                    reject(err)
                } else {
                    instance = client.db(config.db)
                    Mongodb.instance = instance
                    // console.log('mongodb连接成功')
                    resolve(instance)
                }
            })
        })
    }
    // 查询
    find (tableName, json) {
        return new Promise((resolve, reject) => {
            if (this.tableNameIsNull(tableName)) {
                reject('查询表名不能为空')
                return
            }
            if (!json) {
                json = {}
            }
            if (!this.jsonIsObject(json)) {
                reject('参数不是合法的json对象')
                return
            }
            this.connect().then(db => {
                let result = db.collection(tableName).find(json ? json : {})
                result.toArray((err, data) => {
                    if (!err) {
                        resolve(data)
                        return
                    }
                    reject(err)
                })
            })
        })
    }
    // 添加
    add(tableName, json){
        return new Promise((resolve, reject) => {
            if (this.tableNameIsNull(tableName)) {
                reject('查询表名不能为空')
                return
            }
            if (!json) {
                reject('插入对象不能为空')
                return
            }
            if (!this.jsonIsObject(json)) {
                reject('参数不是合法的json对象')
                return
            }
            this.connect().then(db => {
                db.collection(tableName).insertOne(json, (err,result) => {
                    if (!err) {
                        resolve(result)
                        return
                    }
                    reject(err)
                })
            })
        })
    }
    // 更新
    update (tableName, condition, json) {
        if (this.tableNameIsNull(tableName)) {
            reject('更新操作表名不能为空')
            return
        }
        if (!json || !condition) {
            reject('插入对象不能为空')
            return
        }
        if (!this.jsonIsObject(json) || !this.jsonIsObject(condition)) {
            reject('参数不是合法的json对象')
            return
        }
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                db.collection(tableName).updateOne(condition, {
                    $set: json
                }, (err, result) => {
                    if(!err){
                        resolve(result)
                        return
                    }
                    reject(err)
                })
            })
        })
    }
    // 更新多条数据
    updateMany (tableName, condition, json) {
        if (this.tableNameIsNull(tableName)) {
            reject('更新操作表名不能为空')
            return
        }
        if (!json || !condition) {
            reject('插入对象不能为空')
            return
        }
        if (!this.jsonIsObject(json) || !this.jsonIsObject(condition)) {
            reject('参数不是合法的json对象')
            return
        }
        return new Promise((resolve, reject) => {
            this.connect().then(db => {
                db.collection(tableName).updateMany(condition, {
                    $set: json
                }, (err, result) => {
                    if(!err){
                        resolve(result)
                        return
                    }
                    reject(err)
                })
            })
        })
    }
    // 删除
    delete (tableName, condition) {
        return new Promise((resolve, reject) => {
            if (this.tableNameIsNull(tableName)) {
                reject('查询表名不能为空')
                return
            }
            if (!condition) {
                reject('插入对象不能为空')
                return
            }
            if (!this.jsonIsObject(condition)) {
                reject('参数不是合法的json对象')
                return
            }
            this.connect().then(db => {
                db.collection(tableName).deleteOne(condition, (err,result) => {
                    if(!err){
                        resolve(result)
                        return
                    }
                    reject(err)
                })
            })
        })
    }
    // 删除多条数据
    deleteMany (tableName, condition) {
        if (this.tableNameIsNull(tableName)) {
            reject('查询表名不能为空')
            return
        }
        if (!condition) {
            reject('插入对象不能为空')
            return
        }
        if (!this.jsonIsObject(condition)) {
            reject('参数不是合法的json对象')
            return
        }
        return new Promise((resolve, reject) => {
            this.connect().deleteMany(condition, (err, result) => {
                if(!err){
                    resolve(result)
                    return
                }
                reject(err)
            })
        })
    }
    // 表名不能为空判断
    tableNameIsNull (name) {
        if (!name) {
            console.log('查询表名不能为空')
            return true
        }
        return false
    }
    // 参数必须是对象json
    jsonIsObject (json) {
        if (json.constructor !== Object) {
            console.log('参数不是合法的json对象')
            return false
        }
        return true
    }
}

Mongodb.instance = null

module.exports = Mongodb
