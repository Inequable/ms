var sys_path = '../common'

var config_path = __dirname + '/config'
if ('dev' === process.env.NODE_ENV) {
    config_path = __dirname + '/config/dev'
}

var Services = require(sys_path)
var config = require(config_path)

var services = new Services(config)

// 加载服务类方法文件
module.exports = services
