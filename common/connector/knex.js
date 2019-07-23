'use strict'
const knex = require('knex')

// 实现mysql中knex单例
class Knex {
    constructor (config) {
        this.config = config
        return this.init()
    }
    init () {
        if (Knex.instance) {
            // console.log('knex 已经实例化了')
            return Knex.instance
        }
        if (!this.config) {
            throw new Error('Knex: config not found.')
        }
        let instance = knex(this.config)
        Knex.instance = instance
        return instance
    }
}

module.exports = Knex
