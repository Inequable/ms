'use strict'

// 自定义验证类，一般是正则的
class Validate {
    constructor () {
        return this
    }

    /**
     * 合法uri
     * @param {string} uri
     */
    validateURL (uri) {
        const url_regex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
        return url_regex.test(uri)
    }

    /**
     * 小写字母
     * @param {string} str
     */
    validateLowerCase (str) {
        const reg = /^[a-z]+$/
        return reg.test(str)
    }

    /**
     * 大写字母
     * @param {string} str
     */
    validateUpperCase (str) {
        const reg = /^[A-Z]+$/
        return reg.test(str)
    }
    
    /**
     * 大小写字母
     * @param {string} str
     */
    validateAlphabets (str) {
        const reg = /^[A-Za-z]+$/
        return reg.test(str)
    }
    
    /**
     * 腾讯QQ号
     * @param {int} qq
     */
    validateQQ (qq) {
        const reg = /^[1-9][0-9]{4,}$/
        return reg.test(qq)
    }
    
    /**
     * 验证手机号合法性
     * @param {int} phone
     */
    validatePhone (phone) {
        const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57])[0-9]{8}$/
        return reg.test(phone)
    }
    
    /**
     * 验证邮箱合法性
     * @param {string} Email
     */
    validateEmail (Email) {
        const reg = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/
        return reg.test(Email)
    }
    
    /**
     * 正则验证是否是汉字
     * @param {string} Chinese
     */
    validateChinese (Chinese) {
        const reg = /^[\u4e00-\u9fa5]{0,}$/
        return reg.test(Chinese)
    }
    
    /**
     * 身份证号(18位数字)，最后一位是校验位，可能为数字或字符X
     * 只验证18位身份证，不做15位的验证
     * @param {string} IDCard
     */
    validateIDCard (IDCard) {
        if (!(/^\d{17}(\d|x)$/i).test(IDCard)) {
            return false
        }
        // 将获取的参数转化成字符串，方便获取长度
        if (typeof IDCard !== 'string') {
            IDCard += ''
        }
        // 计算长度
        // const len = str.replace(/[^\x00-\xff]/g,'01').length
        // if (len !== 18) {
        //   return false
        // }
        // 身份证前两位所代表的地区
        const city = { 11: '北京', 12: '天津', 13: '河北', 14: '山西', 15: '内蒙古', 21: '辽宁', 22: '吉林', 23: '黑龙江', 31: '上海', 32: '江苏', 33: '浙江', 34: '安徽', 35: '福建', 36: '江西', 37: '山东', 41: '河南', 42: '湖北', 43: '湖南', 44: '广东', 45: '广西', 46: '海南', 50: '重庆', 51: '四川', 52: '贵州', 53: '云南', 54: '西藏', 61: '陕西', 62: '甘肃', 63: '青海', 64: '宁夏', 65: '新疆', 71: '台湾', 81: '香港', 82: '澳门', 91: '国外' }
        // 如果前两位的地区不存在，直接返回false
        if (!city[parseInt(IDCard.substr(0, 2))]) {
            return false
        }
        const birthday = Number(IDCard.substr(6, 4)) + '-' + Number(IDCard.substr(10, 2)) + '-' + Number(IDCard.substr(12, 2))
        const dateTime = new Date(birthday.replace(/-/g, '/'))
        if (birthday !== (dateTime.getFullYear() + '-' + (dateTime.getMonth() + 1) + '-' + dateTime.getDate())) {
            return false
        }
        var sum = 0
        for (let i = 17; i >= 0; i--) {
            sum += (Math.pow(2, i) % 11) * parseInt(IDCard.charAt(17 - i), 11)
        }
        if (sum % 11 !== 1) {
            return false
        }
        // return city[parseInt(IDCard.substr(0, 2))] + ',' + birthday + ',' + (IDCard.substr(16, 1) % 2 ? '男' : '女')
        return true
    }
    
    /**
     * 强密码(必须包含大小写字母和数字的组合，不能使用特殊字符，长度在 6-16 之间)
     * @param {string} password
     */
    validateNotSpecialPassword (password) {
        const reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{6,16}$/
        return reg.test(password)
    }
    
    /**
     * 强密码(必须包含大小写字母和数字的组合，能使用特殊字符，长度在 6-16 之间)
     * @param {string} password
     */
    validateSpecialPassword (password) {
        const reg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,16}$/
        return reg.test(password)
    }
    
    /**
     * 中国邮政编码
     * @param {string} post
     */
    validatePostOffice (post) {
        const reg = /^[1-9]\d{5}(?!\d)$/
        return reg.test(post)
    }
    
    /**
     * 帐号是否合法(字母开头，允许5-16字节，允许字母数字下划线)
     * @param {string} accountNumber
     */
    validateAccountNumber (accountNumber) {
        const reg = /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/
        return reg.test(accountNumber)
    }
    
    /**
     * 中文、英文、数字包括下划线
     * @param {string} nick
     */
    validateNick (nick) {
        const reg = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/
        return reg.test(nick)
    }
    
}

module.exports = Validate
