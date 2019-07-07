'use strict'
var config_path = '../config'
if ('dev' === process.env.NODE_ENV) {
    config_path = '../config/dev'
}
var mysql = require('mysql')
var config = require(config_path + '/database.json')
var connection

var Database = function(){}
Database.prototype.init = function () {
    //-----------------------
    if(!connection){
        console.log('connect to mysql')
        connection = mysql.createConnection(config)
        connection.connect()
        console.log('connect mysql completed')
    }

    return connection

    // connection.end()
    //-----------------------
}

module.exports = Database
