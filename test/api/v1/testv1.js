var service = require('../../app')
var router = service.getExpressRoute()
const path = '../../model/'
var TestDBModel = require(path + 'test_model')
var TestModel = require(path + 'test')
// 读取node-xlsx模块，用于解析或导入文件
var xlsx = service.loadModules('node-xlsx').default
var fs = service.loadModules('fs')

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

// 测试node-xlsx生成文件 Building a xlsx
router.get('/textBuildingXlsx', function (req, res) {
    const data = [[1, 2, 3], [true, false, null, 'sheetjs'], ['foo', 'bar', new Date('2014-02-19T14:30Z'), '0.3'], ['baz', null, 'qux']]
    const options = {}

    // 这两行，一个技术点
    // 在每张纸上跨越多行A1：A4
    // const range = {s: {c: 0, r:0 }, e: {c:0, r:3}} // A1:A4
    // options = {'!merges': [ range ]}

    // 这一行，一个技术点
    // 自定义列宽
    // options = {'!cols': [{ wch: 6 }, { wch: 7 }, { wch: 10 }, { wch: 20 } ]}

    var buffer = xlsx.build([{name: "Sheet1", data: data}], options) // Returns a buffer

    // 将文件内容插入新的文件中
    fs.writeFileSync('test1.xlsx', buffer, {'flag':'w'})
})

router.get('/testReadXLsx', function (req, res) {
    const obj = xlsx.parse('F:/express-project/ms/test/public/ups.csv')
    res.json(obj)
})

module.exports = router
