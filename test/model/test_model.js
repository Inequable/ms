'use strict'
var config_path = '../config'
if ('dev' === process.env.NODE_ENV) {
    config_path = '../config/dev'
}
var service = require('../app')
const MongoDB = service.loadConnector('mongodb')
const mdbConfig = require(config_path + '/mongodb.json')
const Redis = service.loadConnector('redis')
const rdbConfig = require(config_path + '/redis.json')

module.exports = class TestDBModel{
	constructor () {
		return this
	}

    // 测试mysql数据库的查询操作
    getLogisticsAll () {
        const instdb = service.getMysqlInstance()
        return new Promise((resolve, reject) => {
            let sql = 'SELECT * FROM `receptacles`'
            instdb.query(sql, function (err, rows, fields) {
                if (err) throw err
                resolve(rows)
            })
            instdb.end()
        })
    }

    // 测试mongodb数据库查询操作
    getAppsAll () {
        const instdb = service.getMongodbInstance()
        return instdb
        // return new Promise((resolve, reject) => {
        //     let db = new MongoDB()
        //     db.getMongoDB(function (dbo, db) {
        //         dbo.collection("apps").find({}).toArray(function(err, result) { // 返回集合中所有数据
        //             if (err) throw err
        //             resolve(result)
        //         })
        //         db.close()
        //     }, mdbConfig)
        //     resolve(instdb.find('apps', {}))
        // })
    }

    getRedisSet () {
        return new Promise((resolve, reject) => {
            let db = new Redis()
            let client = db.init(rdbConfig)
            client.keys('OWDILE:*', function (err, keys) {
                if (err) {
                    throw err
                }
                console.log(keys)
            })
        })
    }
}
