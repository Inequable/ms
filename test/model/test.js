'use strict'
var service = require('../app')
const sequelize = service.getSequelizeInstance()
const Sequelize = service.loadModules('sequelize')
const Model = Sequelize.Model

class TestModel extends Model {
    getAll () {
        return new Promise((resolve, reject) => {
            TestModel.findAll({
                attributes: { include: ['created'] }
              }).then(infos => {
                // console.log("All infos:", JSON.stringify(infos, null, 4))
                resolve(infos)
            })
        })
    }
}

TestModel.init({
    // 属性
    // firstName: {
    //     type: Sequelize.STRING,
    //     allowNull: false
    // },
    // lastName: {
    //     type: Sequelize.STRING
    //     // allowNull 默认为 true
    // }
}, {
    // 模型的名称。 该模型将以此名称存储在`sequelize.models`中。
    // 在这种情况下，默认为类名。 这将控制自动生成的名称
    //  foreignKey和association命名
    modelName: 'test',
  
    // 不添加时间戳 (updatedAt, createdAt)
    timestamps: false,
  
    // 不删除数据库条目，但设置新添加的属性deletedAt
    // 到当前日期（删除完成时）。 偏执只会起作用
    // 时间戳已启用
    paranoid: false,
  
    // 会自动将所有属性的字段选项设置为蛇形名称。
    // 不覆盖已定义字段选项的属性
    underscored: true,
  
    // 禁用表名修改; 默认情况下，sequelize将自动进行
    // 将所有传递的模型名称（define的第一个参数）转换为复数。
    // 如果您不想要，请设置以下内容
    freezeTableName: true,
  
    // 定义表的名称
    tableName: 'receptacles',
  
    // 启用乐观锁定。 启用后，sequelize将添加版本计数属性
    // 到模型并在保存过时实例时抛出OptimisticLockingError错误。
    // 设置为true或包含要用于启用的属性名称的字符串。
    version: false,

    // 您还可以更改数据库引擎，例如更改为MyISAM。InnoDB是默认的。
    engine: 'InnoDB',

    // 可以在MySQL和PG中为表指定注释
    comment: "I'm a table comment!",
  
    // Sequelize 实例
    sequelize,
})

module.exports = TestModel
