'use strict'
var service = require('../app')

class TestDBModel{
	constructor () {
		return this
	}

    // 测试mysql数据库的查询操作
    async getLogisticsAll () {
        const knex = service.getKnexInstance()
        return await knex('finacial_bill').limit(1).where({
            id: 1
        }).update({status: '1'})
    }

    async getMysql () {
        const mysql = service.getMysqlInstance()
        return new Promise((resolve, reject) => {
            mysql.query('select 1+1 as result', (err, result) => {
                if (err) {
                    throw new Error(err)
                }
                resolve(result)
            })
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
        const redis = service.getRedisInstance()
        return new Promise((resolve, reject) => {
            redis.keys('OWDILE:*', function (err, keys) {
                if (err) {
                    throw err
                }
                console.log(keys)
                resolve(keys)
            })
        })
    }
}

module.exports = TestDBModel
