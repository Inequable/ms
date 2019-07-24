'use strict'
// 加载基础模型类
const BaseModel = require('./model')
// 表名
const TABLE_NAME = 'packages'

class PackagesModel extends BaseModel {
    constructor () {
        super(TABLE_NAME)
    }

    /**
     * 查询获取包裹数据
     * @param {array} fields 需要得到的字段数组
     * @param {array/object} where_data 查询数组对象
     * @param {int} row 限制查询条数
     */
    async getPackages (fields, where_data, row) {
        if (!row) {
            row = 1
        }
        if (fields.length <= 0) {
            fields = ['id']
        }
        let instance = this.instance
        return await instance.column(fields).where(where_data).where('status', '!=', '2')
            .select().from(TABLE_NAME).limit(row).orderBy([{ column: 'id', order: 'desc'}])
    }

    /**
     * 以erp_oid获取包裹信息
     * @param {string} erp_oid erp_oid
     */
    async getPackagesByErpOid (erp_oid) {
        let instance = this.instance
        return await instance(TABLE_NAME).where({
            erp_oid: erp_oid
        }).where('status', '!=', '2').select('id', 'length_unit', 'weight_unit').limit(1)
    }

    /**
     * 根据 package_code 查询获取包裹信息，与partners表相连
     * @param {int} id 包裹条码id
     */
    async getPackageInfoById (id) {
        let instance = this.instance
        return await instance(TABLE_NAME + ' as P').leftJoin('partners as PA', function () {
            this.on('P.partner_id', '=', 'PA.id')
        }).select(['P.id', 'P.label_code', 'P.insurance', 'P.partner_id', 'P.destination_code', 'P.created', 'P.weight_rated', 'PA.name', 'P.status'])
        .where('P.status', '!=', 2).where('P.type', '!=', 101).where('P.id', id).limit(1)
    }

    /**
     * 更新包裹信息中的重量/体积（长度/高度/宽度）
     * @param {array} data 修改信息数组
     * width_rated, length_rated, height_rated, weight_rated, length_unit, weight_unit, updated, erp_oid
     */
    async updatePackagesWeightSize (data, erp_oid) {
        let instance = this.instance
        return await instance(TABLE_NAME).where('status', '!=', '2').where({
            erp_oid: erp_oid
        }).update(data)
    }

    /**
     * 新增包裹数据，单条数据录入
     * @param {object} data 添加数据对象
     */
    async createPackage (data) {
        // 合并对象
        data = Object.assign(this._presetData(), data)
        let instance = this.instance
        // 插入完成后，将返回id值
        return await instance(TABLE_NAME).insert(data)
    }

    /**
     * 修改包裹信息
     * @param {object} data 修改的数据
     * @param {object} where_data 修改条件
     */
    async updatePackages (data, where_data) {
        let instance = this.instance
        return await instance(TABLE_NAME).where('status', '!=', '2').where(where_data).update(data)
    }

    /**
     * 批量更新操作，以id数组集批量更新
     * @param {object} data 更新数据对象
     * @param {array} ids id数组
     */
    async updatePackagesAllByIds (data, ids) {
        let instance = this.instance
        return await instance(TABLE_NAME).whereIn('id', ids).update(data)
    }

    /**
     * 预置数据，用来添加packages表的，防止表不允许为空又没有默认值的时，无法添加数据
     */
    _presetData () {
        let preset_data = {
            sender_mobile: "-",
            sender_country: "-",
            sender_state: "-",
            sender_city: "-",
            sender_zipcode: "-",
            receiver_firstname: "-",
            receiver_lastname: "-",
            receiver_mobile: "-",
            receiver_company: "-",
            receiver_country: "-",
            receiver_state: "-",
            receiver_city: "-",
            receiver_zipcode: "-",
            receiver_translation_state: "-",
            receiver_translation_city: "-",
            receiver_translation_city: "-",
            receiver_translation_city: "-",
            receiver_translation_city: "-",
        }
        return preset_data
    }

}

module.exports = PackagesModel
