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
    
    /**
     * 初始化服务
     */
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

    /**
     * 获取启动项目的全路径
     */
    getProjectPath () {
        return this.allConfig.project_path
    }
    /**
     * 获取系统服务配置
     */
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

    /**
     * 获取权限配置
     */
    getAccessConfig () {
        const config = this.allConfig.access
        if (config.whitelist.constructor !== Array) {
            console.log('白名单不是一个数组')
            return false
        }
        return config
    }
    
    /**
     * 设置设置允许访问应用服务的白名单（目前规则验证IP）
     * @param {array} whitelist 白名单数组
     */
    setWhitelist (whitelist) {
        app.all('*', function (req, res, next) {
            // 获取客户端的真实IP
            let ip = req.headers['x-forwarded-for'] ||
                    req.connection.remoteAddress ||
                    req.socket.remoteAddress ||
                    req.connection.socket.remoteAddress || ''
            // 正则匹配ipv4
            let request_ip = ip.match(/\d+\.\d+\.\d+\.\d+/)[0]
            // 简单做一个跨域处理
            res.header("Access-Control-Allow-Origin", "*")
            res.header("Access-Control-Allow-Headers", "X-Requested-With")
            res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS")
            res.header("X-Powered-By",' 3.2.1')
            res.header("Content-Type", "application/json;charset=utf-8")
            // 如果设置了白名单为 ‘*’ 则代表允许全部
            if (whitelist.indexOf('*') >= 0) {
                next()
                return
            }
            // 以下两行必须注释掉，引以为戒，因为当这个运行时，会获取到ip和域名，一个为真就返回json的，会变成(1 || -1)的判断
            // let hostname = req.hostname
            // if (whitelist.indexOf(request_ip) === -1 || whitelist.indexOf(hostname) === -1) {
            if (whitelist.indexOf(request_ip) === -1) {
                res.status(200)
                res.json({
                    code: 1,
                    msg: '未被认证过的 ip/域名 不允许访问 ' + ip
                })
            } else {
                next()
            }
        })
    }
    
    /**
     * 获取路由配置
     */
    getRouterConfig () {
        const config = this.allConfig.router
        if (config.constructor !== Array) {
            console.log('路由配置不是一个数组')
            return false
        }
        return config
    }
    
    /**
     * 加载node_modules里的模块
     * @param {string} name node_modules模块名称
     */
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
    
    /**
     * 主要是加载基础数据库模型
     * @param {string} name 加载数据连接实例类
     */
    loadConnector (name) {
        const path = './connector/'
        const dba = ['knex', 'mongodb', 'ioredis', 'mysql']
        if (dba.indexOf(name) !== -1) {
            return require(path + name)
        }
        console.log('所加载的数据库基础模型不存在， %s', name)
        return false
    }
    
    /**
     * 返回express，路由类
     */
    getExpressRoute () {
        return express.Router()
    }
    
    /**
     * 返回mongodb实例
     */
    async getMongodbInstance () {
        const dbConfig = this.allConfig.mongodb
        const Mongodb = this.loadConnector('mongodb')
        const instance = await new Mongodb(dbConfig)
        return instance
    }
    
    /**
     * 返回knex实例
     */
    getKnexInstance () {
        const config = this.allConfig.knex
        const Knex = this.loadConnector('knex')
        return new Knex(config)
    }
    
    /**
     * 返回mysql实例连接池
     */
    getMysqlInstance () {
        const config = this.allConfig.knex
        const Mysql = this.loadConnector('mysql')
        const instance = (new Mysql()).init(config.connection)
        return instance
    }

    /**
     * 返回knex实例
     */
    getRedisInstance () {
        const config = this.allConfig.ioredis
        const Redis = this.loadConnector('ioredis')
        return new Redis(config)
    }

    /**
     * 提供可以调用utils方法的实例
     */
    getHelper () {
        const Helper = require('./utils/helper')
        return new Helper()
    }
    
    /**
     * 提供可以调用validate类
     */
    getValidate () {
        const Validate = require('./utils/validate')
        return new Validate()
    }

    /**
     * 加载utils文件夹下的类文件
     * @param {string} name 工具包的名称
     */
    getUtilsPackage (name) {
        return require('./utils/'+ name)
    }
    
}

module.exports = Services
