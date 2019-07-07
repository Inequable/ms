var fs = require('fs')

var sys_path = '../common'

var config_path = __dirname + '/config'
if ('dev' === process.env.NODE_ENV) {
    config_path = __dirname + '/config/dev'
}

var Services = require(sys_path)
var config = loadConfigs(config_path)
var services = new Services(config)

function loadConfigs(path) {
    const dir = path.replace(/\/$/, '')
    const files = fs.readdirSync(path)
    const configs = { "project_path": __dirname }
    for (let key in files) {
        const filename = files[key]
        const reg = new RegExp(/^.*?\.json$/)
        if (reg.test(filename)) {
            const string = fs.readFileSync(dir + '/' + files[key], {encoding: 'utf-8'})
            configs[files[key].split('.')[0]] = JSON.parse(string)
        }
    }
    return configs
}

// 加载服务类方法文件
module.exports = services
