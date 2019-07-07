const Sequelize = require('sequelize')

class BaseModel {
    constructor (config) {
        this.config = config
        return this.init()
    }
    init () {
        if (BaseModel.sequelize) {
            console.log('sequelize实例已存在')
            return BaseModel.sequelize
        }
        let config = this.config
        let sequelize, db, user, password, option
        db = config.database ? config.database : 'test'
        user = config.user ? config.user : 'root'
        password = config.password ? config.password : 'root'
        option = {
            dialect: config.dialect ? config.dialect : 'mysql',
            host: config.host ? config.host : 'localhost',
            port: config.port ? config.port : 3306
        }
        sequelize = new Sequelize(db, user, password, Object.assign(option, config.option))
        this.testConnection(sequelize)
        BaseModel.sequelize = sequelize
        return sequelize
    }
    testConnection (sequelize) {
        sequelize.authenticate().then(() => {
            console.log('数据库测试连接成功。')
        }).catch(err => {
            console.error('数据库无法连接:', err)
        })
    }
}

// 设置静态变量，用来判断是否多次实例化sequelize，从而实现单例
BaseModel.sequelize = null

module.exports = BaseModel