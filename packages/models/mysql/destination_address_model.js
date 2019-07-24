'use strict'
// 加载基础模型类
const BaseModel = require('./model')
// 表名
const TABLE_NAME = 'destination_address'

class DestinationAddressModel extends BaseModel {
    constructor () {
        super(TABLE_NAME)
    }

    /**
     * 以 destination_code 获取目的地址信息
     * @param {string} destination_code 目的地址CODE
     */
    async getDestinationAddrByCode (destination_code) {
        let instance = this.instance
        return await instance(TABLE_NAME).where('destination_code', destination_code).select().limit(1)
    }

}

module.exports = DestinationAddressModel
