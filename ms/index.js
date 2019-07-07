var express = require('express')
var app = new express()
var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
var testv1 = require('./api/v1/testv1')

// ip/域名 有效性检测，除了检测到ipv4的地址，还有可能ipv6的也有可能
var ips = ['::', '127.0.0.1', 'localhost', '172.16.3.184', '192.168.50.240']
app.all('*', function (req, res, next) {
    // 正则匹配ipv4
    const request_ip = req.ip.match(/\d+\.\d+\.\d+\.\d+/)[0]
    const hostname = req.hostname
    // console.log(request_ip)
    if (ips.indexOf(request_ip) === -1 || ips.indexOf(hostname) === -1) {
        res.status(200)
        res.json({
            code: 0,
            msg: '未被认证过的 ip/域名 不允许访问'
        })
    } else {
        next()
    }
})

// 测试用的
app.get('/', function (req, res) {
    res.send('hello world!')
})

app.use('/api/v1', testv1)

var server = app.listen('8081', function () {
    var host = server.address().address
    var port = server.address().port

    // 测试用的四行
    if (host === '::' || host === '127.0.0.1') {
        host = '127.0.0.1'
    }
    // host = '172.16.2.234' // 这行可以将host改成自己本机内网IP，方便其他电脑访问测试

    ips.push(host)
    console.log("应用实例，访问地址为：http://%s:%s", host, port)
    // console.log(server.address())
    // console.log(env)
})