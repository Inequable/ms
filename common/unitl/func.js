// 公共函数类

class Func {
    constructor () {
        return this
    }

    /**
     * 对时间戳进行格式化输出
     * @param {int} time 时间戳(后端)
     * @param {string} cFormat 输出时间的格式类型
     */
    parseTime (time, cFormat) {
        if (arguments.length === 0) {
            return null
        }
        const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
        let date
        if (typeof time === 'object') {
            date = time
        } else {
            if (('' + time).length === 10) time = parseInt(time) * 1000
            date = new Date(time)
        }
        const formatObj = {
            y: date.getFullYear(),
            m: date.getMonth() + 1,
            d: date.getDate(),
            h: date.getHours(),
            i: date.getMinutes(),
            s: date.getSeconds(),
            a: date.getDay()
        }
        const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
            let value = formatObj[key]
            // Note: getDay() returns 0 on Sunday
            if (key === 'a') {
                return ['日', '一', '二', '三', '四', '五', '六'][value]
            }
            if (result.length > 0 && value < 10) {
                value = '0' + value
            }
            return value || 0
        })
        return timeStr
    }
    
    /**
     * 判断当前时间与时间戳相隔多久
     * @param {int} time 时间戳(后端)
     * @param {string} option 是格式化输出时间
     */
    formatTime (time, option) {
        time = +time * 1000
        const d = new Date(time)
        const now = Date.now()
    
        const diff = (now - d) / 1000
    
        if (diff < 30) {
            return '刚刚'
        } else if (diff < 3600) {
            // less 1 hour
            return Math.ceil(diff / 60) + '分钟前'
        } else if (diff < 3600 * 24) {
            return Math.ceil(diff / 3600) + '小时前'
        } else if (diff < 3600 * 24 * 2) {
            return '1天前'
        }
        if (option) {
            return parseTime(time, option)
        } else {
            return (
                d.getMonth() +
                1 +
                '月' +
                d.getDate() +
                '日' +
                d.getHours() +
                '时' +
                d.getMinutes() +
                '分'
            )
        }
    }
    
    /**
     * 这是获取浏览器地址的get参数，转化成对象
     * @param {url} url 浏览器地址
     */
    getQueryObject (url) {
        url = url == null ? window.location.href : url
        const search = url.substring(url.lastIndexOf('?') + 1)
        const obj = {}
        const reg = /([^?&=]+)=([^?&=]*)/g
        search.replace(reg, (rs, $1, $2) => {
            const name = decodeURIComponent($1)
            let val = decodeURIComponent($2)
            val = String(val)
            obj[name] = val
            return rs
        })
        return obj
    }
    
    /**
     * get getByteLen
     * @param {Sting} val input value
     * @returns {number} output value
     */
    getByteLen (val) {
        let len = 0
        for (let i = 0; i < val.length; i++) {
            // (/[^\x00-\xff]/gi
            if (val[i].match(/[^X00-XFF]/gi) != null) {
                len += 1
            } else {
                len += 0.5
            }
        }
        return Math.floor(len)
    }
    
    /**
     * 清除数组中的空值
     * @param {array} actual 实际数组
     */
    cleanArray (actual) {
        const newArray = []
        for (let i = 0; i < actual.length; i++) {
            if (actual[i]) {
                newArray.push(actual[i])
            }
        }
        return newArray
    }
    
    /**
     * 将对象转化成get参数，用来连接浏览器地址
     * @param {object} json 对象
     */
    param (json) {
        if (!json) return ''
        return cleanArray(
            Object.keys(json).map(key => {
                if (json[key] === undefined) return ''
                return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
            })
        ).join('&')
    }
    
    /**
     * 将http地址中？后面的参数，转换成对象
     * @param {uri} url http地址
     */
    param2Obj (url) {
        const search = url.split('?')[1]
        if (!search) {
            return {}
        }
        return JSON.parse(
            '{"' +
                decodeURIComponent(search)
                .replace(/"/g, '\\"')
                .replace(/&/g, '","')
                .replace(/=/g, '":"') +
            '"}'
        )
    }
    
    /**
     * html转文本
     * @param {mixed} val html
     */
    html2Text (val) {
        const div = document.createElement('div')
        div.innerHTML = val
        return div.textContent || div.innerText
    }
    
    /**
     * 合并两个对象，使最后一个对象优先
     * @param {object} target 源对象
     * @param {object} source 目标对象
     */
    objectMerge (target, source) {
        if (typeof target !== 'object') {
            target = {}
        }
        if (Array.isArray(source)) {
            return source.slice()
        }
        Object.keys(source).forEach(property => {
            const sourceProperty = source[property]
            if (typeof sourceProperty === 'object') {
                target[property] = objectMerge(target[property], sourceProperty)
            } else {
                target[property] = sourceProperty
            }
        })
        return target
    }
    
    getTime (type) {
        if (type === 'start') {
            return new Date().getTime() - 3600 * 1000 * 24 * 90
        } else {
            return new Date(new Date().toDateString())
        }
    }
    
    debounce (func, wait, immediate) {
        let timeout, args, context, timestamp, result
    
        const later = function () {
            // 据上一次触发时间间隔
            const last = +new Date() - timestamp
        
            // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
            if (last < wait && last > 0) {
                timeout = setTimeout(later, wait - last)
            } else {
                timeout = null
                // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
                if (!immediate) {
                    result = func.apply(context, args)
                    if (!timeout) context = args = null
                }
            }
        }
    
        return function (...args) {
            context = this
            timestamp = +new Date()
            const callNow = immediate && !timeout
            // 如果延时不存在，重新设定延时
            if (!timeout) timeout = setTimeout(later, wait)
            if (callNow) {
                result = func.apply(context, args)
                context = args = null
            }
        
            return result
        }
    }
    
    /**
     * 这只是深度复制的简单版本
     * 有很多边缘案例bug
     * 如果你想使用一个完美的深度复制品，使用 lodash's _.cloneDeep
     */
    deepClone (source) {
        if (!source && typeof source !== 'object') {
            throw new Error('error arguments', 'shallowClone')
        }
        const targetObj = source.constructor === Array ? [] : {}
        Object.keys(source).forEach(keys => {
            if (source[keys] && typeof source[keys] === 'object') {
                targetObj[keys] = deepClone(source[keys])
            } else {
                targetObj[keys] = source[keys]
            }
        })
        return targetObj
    }
    
    /**
     * 唯一数组
     * @param {array} arr 数组
     */
    uniqueArr (arr) {
        return Array.from(new Set(arr))
    }
    
    /**
     * 是否是外部路径
     * @param {path} path 路径
     */
    isExternal (path) {
        return /^(https?:|mailto:|tel:)/.test(path)
    }
    
    /**
     * 判断是否是移动端
     */
    isMobile () {
        return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
    }
}