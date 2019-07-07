'use strict'
var config_path = '../config'
if ('dev' === process.env.NODE_ENV) {
    config_path = '../config/dev'
}
var MongoClient = require('mongodb').MongoClient
var config = require(config_path + '/mongodb.json')
var username_password = config.username ? config.username + ':' + config.password + '@' : ''
var url = 'mongodb://' + username_password + config.host + ':' + (config.port ? config.port : 27017) + '/'

var Mongodb = function(){}
Mongodb.prototype.getMongoDB = function (callback) {
    MongoClient.connect(url, { useNewUrlParser: true },  function (err, db) {
        if (err) throw err
        var dbo = db.db(config.db)
        console.log("数据库已创建!")
        callback(dbo, db)
    })
}

module.exports = Mongodb
