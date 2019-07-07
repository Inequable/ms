'use strict'
var mysql = require('mysql')
var connection

var Database = function(){}
Database.prototype.init = function (config) {
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
