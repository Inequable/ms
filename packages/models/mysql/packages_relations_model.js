'use strict'
// 加载基础模型类
const BaseModel = require('./model')
// 表名
const TABLE_NAME = 'packages_relations'

class PackagesRelationsModel extends BaseModel {
    constructor () {
        super(TABLE_NAME)
    }

    /**
     * 新增包裹关系数据
     * 当 data 是对象数组时，为批量操作；当 data 仅仅为单个对象时，是单个插入操作
     * @param {object/array} data 添加数据数组对象
     */
    async createPackagesRelations (data) {
        let instance = this.instance
        return await instance(TABLE_NAME).insert(data)
    }

}

module.exports = PackagesRelationsModel
