// 在此目录下一定要有路由这个文件的配置信息，必须存在
const router = require('./router')
// 自定义常量文件，必须存在
const constants = require('./constants')

// 这是一个集合所有 config 的文件
module.exports = {
    // project path 获取启动项目的根路径
    project_path: process.cwd(),

    // https://github.com/luin/ioredis/blob/master/API.md#new_Redis
    // using ioredis https://www.npmjs.com/package/ioredis
    ioredis: {
        host: '192.168.10.10',
        port: 6379,
        password: '',
        keyPrefix: 'OWDILE:'
    },
   
    // using mongodb https://www.npmjs.com/package/mongodb
    // see https://docs.mongodb.com/manual/reference/connection-string/
    mongodb: {
        hosts: [{
            host: '192.168.10.10',
            port: '27017'
        }],
        db: 'owdile',
        username: '',
        password: '',
        authdb: '',
        replicaset: ''
    },

    // https://knexjs.org/#Installation-node
    // using knex.js https://www.npmjs.com/package/knex
    // with mysql https://www.npmjs.com/package/mysql
    knex: {
        client: 'mysql',
        connection: {
            host: '192.168.10.10',
            user: 'saturn001',
            password: 'newlife123',
            database: 'owdile001'
        }
    },

    // access config 权限
    access: {
        whitelist: ['::', '127.0.0.1', 'localhost', '172.16.3.184', '192.168.50.240']
    },

    // host config 主机访问
    sys: {
        host: '172.16.2.234',
        port: '8083'
    },

    // router config 路由，数组对象
    router: (typeof router == 'object') ? router : [],

    // constant config 自定义常量，对象
    constants: (typeof constants == 'object') ? constants : {}

}
