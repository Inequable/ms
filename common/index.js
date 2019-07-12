var express = require('express')
var app = new express()
var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

class Services {
    constructor (allConfig) {
        // 获取所有的配置
        this.allConfig = allConfig
        return this
    }
    // 初始化服务
    init () {
        const service_base_path = this.getProjectPath()

        const access = this.getAccessConfig()
        if (!access.whitelist) return false
        this.setWhitelist(access.whitelist)

        const sys = this.getSysConfig()
        if (!sys) return false

        const router = this.getRouterConfig()
        if (!router) return false
        for (let i = 0; i < router.length; i++) {
            const e = router[i]
            app.use(e.router, require(service_base_path + e.path))
        }

        const server = app.listen(sys.port, sys.host, function () {
            let host = server.address().address
            let port = server.address().port

            // 将自己的服务IP放进去，不然不能自我访问
            access.whitelist.push(host)
            console.log("服务已启动，访问地址为：http://%s:%s", host, port)
        })
    }
    // 获取启动项目的全路径
    getProjectPath () {
        return this.allConfig.project_path
    }
    // 获取系统服务配置
    getSysConfig () {
        const config = this.allConfig.sys
        const pattern = /^\d+$/
        if (!pattern.test(config.port)) {
            console.log('服务系统端口设置不符合规范，无法启动服务')
            return false
        }
        return {
            host: config.host ? config.host : '127.0.0.1',
            port: config.port ? config.port : 8080
        }
    }
    // 获取权限配置
    getAccessConfig () {
        const config = this.allConfig.access
        if (config.whitelist.constructor !== Array) {
            console.log('白名单不是一个数组')
            return false
        }
        return config
    }
    // 设置设置允许访问应用服务的白名单（目前规则验证IP）
    setWhitelist (whitelist) {
        app.all('*', function (req, res, next) {
            // 获取客户端的真实IP
            let ip = req.headers['x-forwarded-for'] ||
                    req.connection.remoteAddress ||
                    req.socket.remoteAddress ||
                    req.connection.socket.remoteAddress || ''
            // 正则匹配ipv4
            let request_ip = ip.match(/\d+\.\d+\.\d+\.\d+/)[0]
            // 以下两行必须注释掉，引以为戒，因为当这个运行时，会获取到ip和域名，一个为真就返回json的，会变成(1 || -1)的判断
            // let hostname = req.hostname
            // if (whitelist.indexOf(request_ip) === -1 || whitelist.indexOf(hostname) === -1) {
            if (whitelist.indexOf(request_ip) === -1) {
                res.status(200)
                res.json({
                    code: 1,
                    msg: '未被认证过的 ip/域名 不允许访问'
                })
            } else {
                // 简单做一个跨域处理
                res.header("Access-Control-Allow-Origin", "*")
                res.header("Access-Control-Allow-Headers", "X-Requested-With")
                res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS")
                res.header("X-Powered-By",' 3.2.1')
                res.header("Content-Type", "application/json;charset=utf-8")
                next()
            }
        })
    }
    // 获取路由配置
    getRouterConfig () {
        const config = this.allConfig.router
        if (config.constructor !== Array) {
            console.log('路由配置不是一个数组')
            return false
        }
        return config
    }
    // 加在node_modules里的模块
    loadModules (name) {
        if (!name) {
            console.log('要加载的模块名称不能为空')
            return false
        }
        if (name.constructor === String) {
            return require(name)
        } else {
            console.log('要加载的模块名称必须未字符串')
            return false
        }
    }
    // 主要是加载基础数据库模型
    loadConnector (name) {
        const path = './connector/'
        const dba = ['database', 'mongodb', 'redis', 'basemodel']
        if (dba.indexOf(name) !== -1) {
            return require(path + name)
        }
        console.log('所加载的数据库基础模型不存在， %s', name)
        return false
    }
    // 获取加载数据库模型的json配置
    getDBConfig (name) {
        const dba = ['database', 'mongodb', 'redis']
        if (dba.indexOf(name) !== -1) {
            const all = this.allConfig
            return all[name]
        }
        console.log('不存在此数据库基础模型的json配置， %s', name)
        return false
    }
    // 返回express，路由类
    getExpressRoute () {
        return express.Router()
    }
    // 返回mysql实例连接池
    getMysqlInstance () {
        const dbConfig = this.getDBConfig('database')
        const Database = this.loadConnector('database')
        const instance = (new Database()).init(dbConfig)
        return instance
    }
    // 返回sequelize实例
    getSequelizeInstance () {
        const dbConfig = this.getDBConfig('database')
        const BaseModel = this.loadConnector('basemodel')
        const sequelize = new BaseModel(dbConfig)
        return sequelize
    }
    // 返回mongodb实例
    async getMongodbInstance () {
        const dbConfig = this.getDBConfig('mongodb')
        const Mongodb = this.loadConnector('mongodb')
        const instance = await new Mongodb(dbConfig)
        // console.log(await instance.find("apps", {}))
        return instance
    }
    // 返回redis实例
    getRedisInstance () {
        const dbConfig = this.getDBConfig('redis')
        const Redis = this.loadConnector('redis')
        // const instance = (new Redis()).init(dbConfig)
        const instance = new Redis(dbConfig)
        return instance
    }
    // 提供可以调用until方法的实例
    getFuncAll () {
        const Func = require('./until/func')
        return new Func()
    }
    // 提供可以调用validate类
    getValidate () {
        const Validate = require('./until/validate')
        return new Validate()
    }
}

module.exports = Services
