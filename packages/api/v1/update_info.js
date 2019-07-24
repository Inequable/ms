const service = require('../../app') // 加载服务类
const func = service.getFuncAll() // 加载服务类中的function函数类
const router = service.getExpressRoute() // 加载路由
const path = '../../logics/v1/'
const PackagesLogic = require(path + 'packages_logic')

// 更新包裹体积和重量信
router.post('/update_size', async (req, res) => {
    // 实例化逻辑类
    let pkg_logic = new PackagesLogic()

    // 获取post数据
    let params = req.body
    // 处理获取的数据源，主要是参数去空处理
    let data = func.trimParams({
        width_rated: params.W,
        length_rated: params.L,
        height_rated: params.H,
        weight_rated: params.weight,
        erp_oid: params.code
    })

    // 到逻辑中处理数据源与业务逻辑的操作
    let result = await pkg_logic.updateSize(data)

    // 响应操作结果，以json形式返回
    res.json(result)
})

// 新增大包裹数据记录
router.post('/addbundlepackage', async (req, res) => {
    let packages_logic = new PackagesLogic()
    let result = await packages_logic.addBigPackage()
    res.json(result)
})

// 大小包裹信息绑定
router.post('/bindpackagesinfo', async (req, res) => {
    let packages_logic = new PackagesLogic()
    // 对对象中的所有参数进行去空格处理
    let params = func.trimParams(req.body)
    let result = await packages_logic.bindPackagesInfo(params.package_token, params.small_code)
    res.json(result)
})

// 删除大包裹下的小包裹
router.get('/delpackage', async (req, res) => {
    let packages_logic = new PackagesLogic()
    let params = func.trimParams(req.query)
    let result = await packages_logic.delPackage(params.id, params.package_token)
    res.json(result)
})

// 大包裹工作流程结束
router.post('/finishwork', async (req, res) => {
    let packages_logic = new PackagesLogic()
    let params = func.trimParams(req.body)
    let result = await packages_logic.finishWork(params.package_code, params.package_token)
    res.json(result)
})

module.exports = router
