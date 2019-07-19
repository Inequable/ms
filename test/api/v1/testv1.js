var service = require('../../app')
var router = service.getExpressRoute()
const path = '../../model/'
var TestDBModel = require(path + 'test_model')
var TestModel = require(path + 'test')

router.get('/test', function (req, res) {
    res.status(200)
    res.json({
        code: 0,
        msg: '这是一个测试接口',
        data: {
            request_ip: req.ip.match(/\d+\.\d+\.\d+\.\d+/)[0],
            params: req.params
        }
    })
})

router.get('/testdb', async (req, res) => {
    const model = new TestDBModel()
    const result = await model.getLogisticsAll()
    // console.log(result)
    res.json(result)
})

router.get('/testMongodb', async (req, res) => {
    const model = new TestDBModel()
    // const result = await model.getAppsAll()
    const result = await model.getApps()
    res.json(result)
})

router.get('/redistest', async (req, res) => {
    const model = new TestDBModel()
    await model.getRedisSet()
})

router.get('/testSequelize', async (req, res) => {
    const model = new TestModel()
    const result = await model.getAll()
    res.json(result)
})

module.exports = router
