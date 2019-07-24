'use strict'
// 加载基础模型类
const BaseModel = require('./model')
// 表名
const TABLE_NAME = 'packages_clearances'

class PackagesClearancesModel extends BaseModel {
    constructor () {
        super(TABLE_NAME)
    }

    /**
     * 以 package_id 获取包裹清关服务信息
     * @param {int} package_id 包裹id
     */
    async getCleatanceByPackageId (package_id) {
        let instance = this.instance
        return await instance(TABLE_NAME).select().where('package_id', package_id).limit(1)
    }

    /**
     * 新增包裹清关数据
     * @param {object} data 添加数据数组对象
     */
    async createPackagesClearances (data) {
        // 合并数组对象
        let instance = this.instance
        return await instance(TABLE_NAME).insert(data)
    }

}

module.exports = PackagesClearancesModel
