/**
 * 快递单号规则，将扫描的单号作为参数，然后根据规则匹配各个快递公司，再将其与数据库对应的单号返回
 * 使用方法：初始化这个类并传参进扫描单号就行了
 *          new ExpressRules(tracking_number)
 *          return new_tracking_number
 */
'use strict'

class ExpressRules {
    constructor (tracking_number) {
        this.tracking_number = tracking_number
        if (!tracking_number) {
            return { ret: -1, msg: '扫描快递单号不能为空！' }
        }
        let name = this.returnCompany(tracking_number)
        if (!name) {
            return { ret: -1, msg: '暂不支持支持此中快递类型的包裹' }
        }
        // 调用对应的方法返回与数据库中单号对应的值
        let num = eval(`this._${name}()`)
        return { ret: 0, msg: '单号规则重置成功', data: num }
    }

    /**
     * 所有快递规则的名称，写完的快递规则，需要在此添加进方法数组
     */
    expressNameAll () {
        return ['usps', 'ups']
    }

    /**
     * 根据快递扫描单号将其匹配后返回快递公司名称
     * @param {string} tracking_number 快递扫描单号
     */
    returnCompany (tracking_number) {
        let name = ''
        // 获取所有的快递规则，其实先获取名称
        this.expressNameAll().some(f => {
            name = eval(`this._${f}Rule(tracking_number)`)
            if (name) {
                // 当name有值时，则返回
                return true
            }
        })
        return name
    }

    /**
     * ups的快递单号规则，如果匹配则返回name=usps，否则返回name=null
     * @param {string} tracking_number 扫描的快递单号
     */
    _uspsRule (tracking_number) {
        let name = ''
        // usps正则：扫描单号前3位必须以420开头，并且至少大于8位的
        let reg = /^420[0-9]{6,}$/
        if (reg.test(tracking_number)) {
            name = 'usps'
        }
        return name
    }

    _usps () {
        // 截取掉前8位
        return this.tracking_number.substring(8, this.tracking_number.length)
    }

    /**
     * ups的快递单号规则
     * @param {string} tracking_number 扫描的快递单号
     */
    _upsRule (tracking_number) {
        let name = ''
        // usps正则：( # 代表字母, * 代表数字, ! 代表字母或数字 ）(1Z !!! !!! !!! *** *** *)
        let reg = /^1Z[A-Z|0-9]{9}\d{7}$/
        if (reg.test(tracking_number)) {
            name = 'ups'
        }
        return name
    }

    _ups () {
        // 原样返回
        return this.tracking_number
    }

}

module.exports = ExpressRules
