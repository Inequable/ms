'use strict'
const Redis = require("ioredis")

class IORedis {
    constructor (config) {
        this.config = config
        return this.init()
    }
    init () {
        if (IORedis.instance) {
            // console.log('IORedis已经创建过实例了')
            return IORedis.instance
        }
        let config = this.config
        let instance = new Redis(config)
        IORedis.instance = instance
        return instance
    }
}

module.exports = IORedis
