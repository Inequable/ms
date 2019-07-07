'use strict'
const redis = require("redis")

// var client
// var Redis = function(){}
// Redis.prototype.init = function (config) {
//     if (!client) {
//         client = redis.createClient(config)
//         client.on('connect', function () {
//             console.log('已连接到redis');
//         })
//         client.on("error", function (err) {
//             console.log("[Error] ~ " + err)
//         })
//     }
//     return client
// }

class Redis {
    constructor (config) {
        this.config = config
        return this.init()
    }
    init () {
        if (Redis.instance) {
            console.log('redis已经创建过实例了')
            return Redis.instance
        }
        let config = this.config
        let instance = redis.createClient(config)
        instance.on('connect', function () {
            console.log('已连接到redis');
        })
        instance.on("error", function (err) {
            console.log("[Error] ~ " + err)
        })
        Redis.instance = instance
        return instance
    }
}

Redis.instance = null

module.exports = Redis
