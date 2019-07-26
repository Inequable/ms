'use strict'

class OS {
    constructor () {
    }

    /**
     * Node.js os 模块提供了一些基本的系统操作函数
     */
    requireOS () {
        return require('os')
    }

    /**
     * 服务系统的一些状态
     */
    system () {
        let os = this.requireOS()
        return {
            // 返回操作系统的默认临时文件夹。
            tmpdir: '操作系统的默认临时文件夹: '+ os.tmpdir(),
            // 返回 CPU 的字节序，可能的是 "BE" 或 "LE"。
            endianness: 'CPU 的字节序: '+ os.endianness(),
            // 返回操作系统的主机名。
            hostname: '操作系统的主机名: '+ os.hostname(),
            // 返回操作系统名，系统类型，例如返回值是 linux 是 Linux 系统，Darwin 是 macOS 系统，Windows_NT 是 Windows 系统
            type: '操作系统名： '+ os.type(),
            // 返回编译时的操作系统名
            platform: '编译时的操作系统名： '+ os.platform(),
            // 返回操作系统 CPU 架构，可能的值有 "x64"、"arm" 和 "ia32"。
            arch: '操作系统 CPU 架构： '+ os.arch(),
            // 返回操作系统的发行版本。
            release: '操作系统的发行版本： '+ os.release(),
            // 返回操作系统运行的时间，以秒为单位。
            uptime: '操作系统运行时间： '+ os.uptime() +' s',
            // 返回系统内存总量，单位为字节。
            totalmem: '系统内存总量： '+ os.totalmem() +' bytes',
            // 返回操作系统空闲内存量，单位是字节。
            freemem: '系统内存总量： '+ os.freemem() +' bytes',
            // home目录
            homedir: 'home目录： '+ os.homedir(),
            // 平均负载
            loadavg: os.loadavg(),
            // 返回一个对象数组，包含所安装的每个 CPU/内核的信息：型号、速度（单位 MHz）、时间（一个包含 user、nice、sys、idle 和 irq 所使用 CPU/内核毫秒数的对象）。
            cpus: os.cpus(),
            // 获得网络接口列表。
            networkInterfaces: os.networkInterfaces(),
            // 系统用户信息
            userInfo: os.userInfo(),
            // 操作系统常量，可以获取系统的 SIGNAL、ERRORNO 和 LIBUV 常量的相关信息
            constants: os.constants,
            // 定义了操作系统的行尾符的常量。
            eol: '操作系统的行尾符的常量： '+ os.EOL
        }
    }
    
}

module.exports = OS
