'use strict'
const path = '../connector/'
const Database = require(path + 'database')
const MongoDB = require(path + 'mongodb')
const Redis = require(path + 'redis')

module.exports = class TestDBModel{
	constructor () {
		return this
	}

    // 测试mysql数据库的查询操作
    getLogisticsAll () {
        return new Promise((resolve, reject) => {
            let db = new Database()
            let connection = db.init()
            let sql = 'SELECT * FROM `logistics`'
            connection.query(sql, function (err, rows, fields) {
                if (err) throw err
                resolve(rows)
            })
            connection.end()
        })
    }

    // 测试mongodb数据库查询操作
    getAppsAll () {
        return new Promise((resolve, reject) => {
            let db = new MongoDB()
            db.getMongoDB(function (dbo, db) {
                dbo.collection("apps").find({}).toArray(function(err, result) { // 返回集合中所有数据
                    if (err) throw err
                    resolve(result)
                })
                db.close()
            })
        })
    }

    getRedisSet () {
        return new Promise((resolve, reject) => {
            let db = new Redis()
            let client = db.init()
            client.keys('OWDILE:*', function (err, keys) {
                if (err) {
                    throw err
                }
                console.log(keys)
            })
        })
    }
}
