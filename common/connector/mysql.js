'use strict'
var mysql = require('mysql')
var connection

var Mysql = function(){}
Mysql.prototype.init = function (config) {
    if(!connection){
        // console.log('connect to mysql')
        connection = mysql.createConnection(config)
        connection.connect()
        // 测试连接
        // connection.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
        //     if (err) throw err
          
        //     console.log('The solution is: ', rows[0].solution)
        // })
        // console.log('connect mysql completed')
    }

    return connection

    // connection.end()
}

module.exports = Mysql
