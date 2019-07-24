'use strict'
var service = require('../../app')

/**
 * 基础模型类
 */
class BaseModel {
    constructor(TABLE_NAME) {
        this._table = TABLE_NAME
    }

    /**
     * @returns {Promise<Knex.knex>}
     */
    get instance() {
        return service.getKnexInstance()
    }

    /**
     * @returns {Promise<Knex.knex>}
     */
    static get Instance() {
        return service.getKnexInstance()
    }

    /**
     * 开始事务
     * @param   {string/null}   msg  信息记录
     */
    async beginTransaction (msg) {
        msg = msg ? msg + ':' : ''
        return await this.instance.raw('begin').then(() => {
            console.log(msg + ' 事务开启中...')
        }).catch(() => {
            console.trace('事务开启失败...')
        })
    }

    /**
     * 事务回滚
     * @param   {string/null}   msg  信息记录
     */
    async rollback (msg) {
        msg = msg ? msg + ':' : ''
        return await this.instance.raw('rollback').then(() => {
            console.log(msg + ' 事务已回滚')
        }).catch(() => {
            console.trace(msg + ' 事务回滚失败...')
        })
    }

    /**
     * 提交事务
     * @param   {string/null}   msg  信息记录
     */
    async commit (msg) {
        msg = msg ? msg + ':' : ''
        return await this.instance.raw('commit').then(() => {
            console.log(msg + ' 事务已提交')
        }).catch(() => {
            console.trace(msg + ' 事务提交失败...')
        })
    }

}

module.exports = BaseModel
