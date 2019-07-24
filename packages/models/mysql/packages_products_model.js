'use strict'
// 加载基础模型类
const BaseModel = require('./model')
// 表名
const TABLE_NAME = 'packages_products'

class PackagesProductsModel extends BaseModel {
    constructor () {
        super(TABLE_NAME)
    }

    /**
     * 获取包裹商品信息，主要使用 where in 和 group by 还有 sum
     * @param {array} package_ids 商品包裹ids
     */
    async getProductsInfo (package_ids) {
        let instance = this.instance
        return await instance(TABLE_NAME).whereIn('package_id', package_ids).select('product_id').groupBy('product_id')
            .sum({ amount: 'amount' })
    }

    /**
     * 新增包裹商品关系数据
     * 当 data 是对象数组时，为批量操作；当 data 仅仅为单个对象时，是单个插入操作
     * @param {object/array} data 添加数据数组对象
     */
    async createPackagesProducts (data) {
        let instance = this.instance
        return await instance(TABLE_NAME).insert(data)
    }

}

module.exports = PackagesProductsModel
