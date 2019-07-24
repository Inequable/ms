var services = require('./app')

// 启动服务文件
if (require.main.filename === __filename) {
    services.init()
}
