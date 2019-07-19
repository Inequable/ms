'use strict'
var service = require('../app')

class TestDBModel{
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
    async getAppsAll () {
        // console.time()
        const instdb = await service.getMongodbInstance()
        const result = await instdb.find("labels_contents", {})
        // console.timeEnd()
        return result
    }

    // 使用mongodb类实力化连接，用连接池操作mongodb的内部方法
    async getApps () {
        const instdb = await service.getMongodbInstance()
        return new Promise(async (resolve, reject) => {
            await instdb.connect().then(db => {
                let t = db.collection('apps').find({})
                t.toArray((err, data) => {
                    if (!err) {
                        resolve(data)
                        return
                    }
                    reject(err)
                })
            })
        })
    }

    // redis单例测试
    getRedisSet () {
        const instdb = service.getRedisInstance()
        instdb.keys('OWDILE:*', function (err, keys) {
            if (err) {
                throw err
            }
            console.log(keys)
            return keys
        })
    }
}

module.exports = TestDBModel
