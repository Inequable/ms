'use strict'
var config_path = '../config'
if ('dev' === process.env.NODE_ENV) {
    config_path = '../config/dev'
}
const redis = require("redis")
const config = require(config_path + '/redis.json')

var client
var Redis = function(){}
Redis.prototype.init = function () {
    if (!client) {
        client = redis.createClient(config)
        client.on("error", function (err) {
            console.log("[Error] ~ " + err)
        })
    }
    return client
}

module.exports = Redis
