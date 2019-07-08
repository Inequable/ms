'use strict'
var service = require('../app')

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
    async getAppsAll () {
        // console.time()
        const instdb = await service.getMongodbInstance()
        const result = await instdb.find("labels_contents", {})
        // console.timeEnd()
        return result
    }

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
