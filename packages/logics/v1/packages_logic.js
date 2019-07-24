var config_path = process.cwd() + '/config/'
if ('dev' === process.env.NODE_ENV) {
    config_path = process.cwd() + '/config/dev/'
}
const path = '../../models/mysql/'

const service = require('../../app')
const PackagesModel = require(path + 'packages_model')
const PackagesClearancesModel = require(path + 'packages_clearances_model')
const DestinationAddressModel = require(path + 'destination_address_model')
const PackagesRelationsModel = require(path + 'packages_relations_model')
const PackagesProductsModel = require(path + 'packages_products_model')
const Constants = require(config_path + 'constants')
const helper = service.getHelper()

class PackagesLogic {
    constructor () {}

    /**
     * 最小单位换算，长度对比单位是mm ；重量是 g
     * @param {string} unit 单位
     * @param {string} type 换算类型，目前又 l 长度；w 重量 两种
     */
    unitConversion (unit, type) {
        // 长度单位 cm: 厘米  in: 英寸 (1英寸(in)=25.4毫米(mm)。)
        let length_units = ['mm', 'cm', 'in']
        // 重量单位: lb: 磅， kg:  千克   oz: 盎司 (1 g~0.035274 盎司(oz))(1 g~~0.0022046 磅(lb))
        let weight_units = ['g', 'kg', 'oz', 'lb']
        if (type === 'l' && length_units.indexOf(unit) !== -1) {
            return length_units.indexOf(unit) < 2 ? Math.pow(10, length_units.indexOf(unit)) : 25.4
        }
        if (type === 'w' && weight_units.indexOf(unit) !== -1) {
            if (weight_units.indexOf(unit) < 2) {
                return Math.pow(1000, weight_units.indexOf(unit))
            }
            if (weight_units.indexOf(unit) === 2) {
                return 0.035
            }
            if (weight_units.indexOf(unit) === 3) {
                return 0.002
            }
        }
        return {
            code: -1,
            error: '单位错误'
        }
    }

    /**
     * 更新包裹的体积和重量
     * @param {object} data 更新数据源
     */
    async updateSize (data) {
        let pattern = /^\d+(\.\d+)?$/
        if (!data.width_rated || !pattern.test(data.width_rated) )
            return { error: 'width_rated 类型必须是数字，并且不能空', code: -1 }
        if (!data.length_rated || !pattern.test(data.length_rated) )
            return { error: 'length_rated 类型必须是数字，并且不能空', code: -1 }
        if (!data.height_rated || !pattern.test(data.height_rated) )
            return { error: 'height_rated 类型必须是数字，并且不能空', code: -1 }
        if (!data.weight_rated || !pattern.test(data.weight_rated) )
            return { error: 'weight_rated 类型必须是数字，并且不能空', code: -1 }
        if (!data.erp_oid || data.erp_oid.toLowerCase() === 'null')
            return { error: 'erp_oid 不能为空', code: -1}
        // 前端与后端的时间戳，取的最小单位不一样，前端最小是毫秒
        let updated = parseInt((new Date() * 1) / 1000)
        let pkg_model = new PackagesModel()
        let result = await pkg_model.getPackagesByErpOid(data.erp_oid)
        if (!result[0]) {
            return {
                code: -1,
                error: '查无此单号包裹信息，请人工检查'
            }
        }
        if (result.length > 1) {
            return {
                code: -1,
                error: '查无此单号包裹信息有重复，请人工检查'
            }
        }
        let row = result[0]
        let calculation = []
        for (const key in row) {
            if (row.hasOwnProperty(key)) {
                // `id`, `length_unit`, `weight_unit`
                const e = row[key]
                if (key !== 'id') {
                    let type = 'l'
                    if (key === 'weight_unit') {
                        type = 'w'
                    }
                    calculation.push(this.unitConversion(e, type))
                }
            }
        }
        // console.log(calculation, row)
        let res = await pkg_model.updatePackagesWeightSize({
            // 除以进制后保留两位
            width_rated: (data.width_rated/calculation[0]).toFixed(2),
            length_rated: (data.length_rated/calculation[0]).toFixed(2),
            height_rated: (data.height_rated/calculation[0]).toFixed(2),
            weight_rated: (data.weight_rated/calculation[1]).toFixed(2),
            updated
        }, data.erp_oid)
        return {
            code: res === 1 ? 0 : -1,
            error: res === 1 ? 'upload success' : res
        }
    }

    /**
     * 新建大包裹
     */
    async addBigPackage () {
        let pkg_model = new PackagesModel()
        
        let code = ''
        let data = {
            type: "101",
            created: (new Date()*1)/1000
        }

        // 开启事务进行操作
        let msg = '新建大包裹'
        await pkg_model.beginTransaction(msg)

        // 新建大包裹的记录
        let id = await pkg_model.createPackage(data)
        if (id.length <= 0) {
            await pkg_model.rollback(msg)
            return { ret: -1, msg: '新增大包裹记录是失败，未知错误' }
        }

        // 获取新建记录的id，用于生成code，然后更新其新建的记录
        code = helper.idCodeSalting(id[0])

        // 更新新建的大包裹记录，code值赋予package_code/logistics_code/label_code
        let update_result = await pkg_model.updatePackages({
            package_code: 'LPK' + code,
            logistics_code: 'LPK' + code,
            label_code: 'LPK' + code
        }, { id })
        if (!update_result) {
            await pkg_model.rollback(msg)
            // 主要是更新失败，事务回滚，数据库表将无此记录
            return { ret: -1, msg: '新增大包裹记录失败，未知错误' }
        }

        // 提交事务
        await pkg_model.commit(msg)

        return {
            ret: 0,
            msg: '新建大包裹记录成功',
            data: {
                id: id[0],
                package_code: 'LPK' + code
            }
        }
    }

    /**
     * 大小包裹的数据信息绑定
     * @param {string} package_token 虚拟大包裹值，用于redis存储的一个标识
     * @param {string} small_code 小包裹条码，指的是 packages 表中的 label_code 字段
     */
    async bindPackagesInfo (package_token, small_code) {
        if (!package_token) {
            return { ret: -1, msg: '虚拟大包裹条码不能为空' }
        }
        // 由于接收到的虚拟值都是数字，所以为其加上前缀
        package_token = Constants.MS_PACKAGES_CHANGE_PACKAGRS + package_token

        // 实例化模型类
        let pkg_model = new PackagesModel()
        let pkg_clearances_model = new PackagesClearancesModel()
        
        // 获取redis单例
        let redis = service.getRedisInstance()

        // 小包裹条码不能为空
        if (!small_code || small_code.length < 8) {
            return { ret: -1, msg: '包裹条码不能为空，并且大于8位' }
        }
        // 暂时的一个截取，去掉前8位数，在实际使用需要这样
        small_code = small_code.substring(8, small_code.length)

        // 用label_code 查询一个id
        let pkg_info_id = await pkg_model.getPackages(['id'], { label_code: small_code })
        if (pkg_info_id.length <= 0) {
            return { ret: -1, msg: '查无此包裹信息' }
        }

        // 以package_id获取package信息
        let pkg_infos = await pkg_model.getPackageInfoById(pkg_info_id[0].id)
        if (pkg_infos.length <= 0) {
            return { ret: -1, msg: '查无此包裹信息，也有可能这是一个大包裹' }
        } else {
            let package_status = pkg_infos[0].status 
            if ([0, 4].indexOf(package_status) === -1) {
                return { ret: -1, msg: '该包裹状态不允许录入' }
            }
        }

        // 查询此包裹是否有清关服务功能
        let clearances_infos = await pkg_clearances_model.getCleatanceByPackageId(pkg_infos[0].id)
        if (clearances_infos.length <= 0) {
            return { ret: -1, msg: '包裹未使用清关服务，无法录入' }
        }
        // 当包裹清关服务 clearance_service = 1 时需要清关服务，反之不需要
        if (clearances_infos[0].clearance_service != 1) {
            return { ret: -1, msg: '此包裹不需要清关服务' }
        }

        // 将清关服务的商品描述放入redis，方便完成作业的操作
        pkg_infos[0].goods_descriptions = clearances_infos[0].goods_descriptions

        // 将价值转化成浮点型小数，而且保留两位小数
        pkg_infos[0].insurance = helper.fomatFloat(pkg_infos[0].insurance, 2)

        // 查询是否重复将小包裹加入大包裹中，去重
        // 主要将小包裹id去redis中查是否存在
        let redis_package_data = await redis.hget(package_token, pkg_infos[0].id, function (err, res) {
            if (err) {
                console.trace('redis hget 查询出错： %s', err.message)
                return { ret: -1, msg: '未知错误' }
            }
        })
        if (redis_package_data) {
            return { ret: -1, msg: '该包裹已经录入，不可重复录入' }
        }

        // 判断redis中是否存在key
        let tf = await redis.exists(package_token)
        // 如果还没有录入的情况，需要检查商家id，目的地一致，包裹总价值不能超过800
        if (!tf) { // 为空，第一条入redis的数据
            // 检查第一次录入时，是不是 单个包裹就已经超过800了
            if (pkg_infos[0].insurance > 800) {
                return { ret: -1, msg: '大包裹总价值不允许超过800' }
            }
            // 利用 hash 存储大小包裹信息，并设置过期时间1天 1*3600*24 s
            await redis.hset(package_token, pkg_infos[0].id, JSON.stringify(pkg_infos[0]), function (err, res) {
                if (err) {
                    console.trace('redis hset hash插入出错： %s', err.message)
                    return { ret: -1, msg: '未知错误' }
                }
            })
            await redis.expire(package_token, 86400)
            return { ret: 0, msg: '已插入redis', data: { list: pkg_infos, total_insurance: pkg_infos[0].insurance } }
        }

        let small_packages = null, package_list = [], total = 0
        await redis.hgetall(package_token).then((result) => {
            small_packages = result
        }).catch((err) => {
            console.trace('redis hgetall 查询出错： %s', err.message)
        })
        for (const key in small_packages) {
            if (small_packages.hasOwnProperty(key)) {
                const element = JSON.parse(small_packages[key])
                // 价值累加
                total += parseFloat(element.insurance)
                // 将redis的对象value值拿出来并转换成对象放入数组
                package_list.push(element)
            }
        }
        if (pkg_infos[0].partner_id !== package_list[0].partner_id) {
            return { ret: -1, msg: '必须录入同一个商家的包裹' }
        }
        if (pkg_infos[0].destination_code !== package_list[0].destination_code) {
            return { ret: -1, msg: '必须录入同一个目的地的包裹' }
        }
        total += parseFloat(pkg_infos[0].insurance)
        if (total > 800) {
            return { ret: -1, msg: '大包裹总价值不允许超过800' }
        }

        await redis.hset(package_token, pkg_infos[0].id, JSON.stringify(pkg_infos[0]), function (err, res) {
            if (err) {
                console.trace('redis hset hash插入出错： %s', err.message)
                return { ret: -1, msg: '未知错误' }
            }
        })
        await redis.expire(package_token, 86400)
        return { ret: 0, msg: '数据回显', data: { list: pkg_infos, total_insurance: helper.fomatFloat(total, 2)}}

    }

    /**
     * 删除未结束作业列表中小包裹id
     * @param {int} id 小包裹id
     * @param {string} package_token 虚拟大包裹条码，redis的唯一key
     */
    async delPackage (id, package_token) {
        if (!id) {
            return { ret: -1, msg: '非法参数，id不能为空' }
        }
        if (!package_token) {
            return { ret: -1, msg: '非法参数' }
        }
        package_token = Constants.MS_PACKAGES_CHANGE_PACKAGRS + package_token

        let redis = service.getRedisInstance()
        let result = await redis.hdel(package_token, id)
        if (!result) {
            return { ret: -1, msg: '删除失败，此小包裹记录不存在' }
        }
        return { ret: 0, msg: '删除成功' }
        // 重新获取所有的数据，前端解决，后端就不用处理了
        // let org_list = [], total_insurance = 0
        // let small_list = await redis.hgetall(package_token)
        // for (const key in small_list) {
        //     if (small_list.hasOwnProperty(key)) {
        //         const element = JSON.parse(small_list[key])
        //         // 将redis的对象value值拿出来并转换成对象放入数组
        //         total_insurance += parseFloat(element.insurance)
        //         org_list.push(element)
        //     }
        // }
        // return { ret: 0, msg: '作业数据回显', data: { list: org_list, total_insurance}}
    }

    /**
     * 结束作业
     * @param {string} code 大包裹条码真实值/ label_code 这里说的是这个
     * @param {string} package_token 大包裹条码虚拟值，用于redis
     */
    async finishWork (code, package_token) {
        if (!code) {
            return { ret: -1, msg: '大包裹条码不能为空**' }
        }
        if (!package_token) {
            return { ret: -1, msg: '没有大包裹条码虚拟值' }
        }
        package_token = Constants.MS_PACKAGES_CHANGE_PACKAGRS + package_token

        let pkg_model = new PackagesModel()
        let relations_model = new PackagesRelationsModel()
        let products_model = new PackagesProductsModel()
        let clearances_model = new PackagesClearancesModel()
        let address_model = new DestinationAddressModel()
        
        let redis = service.getRedisInstance()

        // 用label_code 查询一个id,到数据确定是否已生成package_code
        let pkg_infos = await pkg_model.getPackages(['id'], { label_code: code }, 1)
        if (pkg_infos.length <= 0) {
            return { ret: -1, msg: '数据库查无此记录' }
        }

        // 使用大包裹虚拟 redis 唯一值查找绑定的数据
        let pkg_object = await redis.hgetall(package_token)
        if (!pkg_object) {
            return { ret: -1, msg: '大包裹未绑定任何小包裹数据' }
        }

        // 循环得到域/总重量/总价值
        let fields = [], total_weight = 0, total_insurance = 0, destination_code = '', goods_descriptions_list = [], partner_id = 0
        for (const key in pkg_object) {
            if (pkg_object.hasOwnProperty(key)) {
                const e = JSON.parse(pkg_object[key])
                // 将小包裹的id放入数组中
                fields.push(parseInt(key))
                // 合记总重量
                if (e.weight_rated != null) {
                    total_weight += parseFloat(e.weight_rated)
                }
                // 合计总价值
                if (e.insurance) {
                    total_insurance += parseFloat(e.insurance)
                }
                // 获得目的地地址code，用于查找目的地地址城市
                destination_code = e.destination_code
                // 获得 partner_id 的
                partner_id = e.partner_id
                // 获取商品描述数组
                goods_descriptions_list.push(e.goods_descriptions)
            }
        }

        // 查询获取 destination_address 表，获取目的地代码的城市名称
        let addr_result = await address_model.getDestinationAddrByCode(destination_code)
        if (addr_result.length <= 0) {
            return { ret: -1, msg: '查无目的地地址城市信息' }
        }

        // 事务开启
        let msg = '结束大小包裹工作流程'
        await pkg_model.beginTransaction(msg)
        
        // 插入packages_relatios的大小包裹id关联
        let relations_data_list = []
        for (let i = 0; i < fields.length; i++) {
            const e = fields[i]
            relations_data_list.push({
                package_id: pkg_infos[0].id,
                package_relations_id: e,
                created: (new Date()*1)/1000
            })
        }
        // 进行批量操作
        let relations_result = await relations_model.createPackagesRelations(relations_data_list)
        if (!relations_result) {
            await pkg_model.rollback(msg)
            return { ret: -1, msg: '无法更新数据*' }
        }

        // 更新大包裹的重量（实测和预报），价值，目的地
        let update_package = await pkg_model.updatePackages({
            weight_unit: 'g',
            partner_id: partner_id,
            destination_code: destination_code,
            weight_rated: total_weight,
            weight_report: total_weight,
            insurance: helper.fomatFloat(total_insurance, 2)
        }, { id: pkg_infos[0].id })
        if (!update_package) {
            await pkg_model.rollback(msg)
            return { ret: -1, msg: '无法更新数据**' }
        }

        // 获取小包裹的所有商品信息集合
        let product_set = await products_model.getProductsInfo(fields)
        if (product_set.length <= 0) {
            await pkg_model.rollback(msg)
            return resolve({ ret: -1, msg: '无法更新数据***' })
        }

        // 新建大包裹商品关系
        let products_data_list = []
        for (let i = 0; i < product_set.length; i++) {
            const e = product_set[i];
            products_data_list.push({
                package_id: pkg_infos[0].id,
                product_id: e.product_id,
                amount: e.amount,
                created: (new Date()*1)/1000
            })
        }
        // 批量操作
        let add_result = await products_model.createPackagesProducts(products_data_list)
        if (!add_result) {
            await pkg_model.rollback(msg)
            return { ret: -1, msg: '无法更新数据****' }
        }

        // 更新小包裹的状态status=5，进行ids的批量更新操作
        let update_status = await pkg_model.updatePackagesAllByIds({ status: 5 }, fields)
        if (!update_status) {
            await pkg_model.rollback(msg)
            return { ret: -1, msg: '无法更新数据*****' }
        }

        // 新增清关服务大包裹的数据
        let add_clearances = await clearances_model.createPackagesClearances({
            package_id: pkg_infos[0].id,
            hawb: code,
            clearance_service: 1,
            clearance_country: addr_result[0].country,
            status_clearance: 0,
            status_router: 0,
            goods_descriptions: (helper.uniq((helper.uniq(goods_descriptions_list)).join(',').split(','))).join(','), // 将商品描述数组去重后，在拼接成字符串，需要使用两次分割（join,split）
            created: (new Date()*1)/1000
        })
        if (!add_clearances) {
            await pkg_model.rollback(msg)
            return { ret: -1, msg: '无法更新数据******' }
        }

        await pkg_model.commit(msg)
        // 删除已用完的key
        await redis.del(package_token)
        return { ret: 0, msg: '作业已结束' }

    }

}

module.exports = PackagesLogic
