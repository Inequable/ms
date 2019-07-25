# 框架结构

这是一个有express搭建而成的服务，运行开发模式，使用命令：
` set NODE_ENV=dev && node xxx.js (windows)   export NODE_ENV=dev && node xxx.js (linux|Mac) ` 建议分开运行

这是所有服务的一个核心框架所在
- common                       核心文件夹
- |——connector                 数据库单例文件夹
- |——|——kenx.js                knex ORM 单例封装（主要操作- mysql）
- |——|——mongodb.js             mongodb单例封装以及实现简单的dao- 操作
- |——|——ioredis.js             redis单例封装
- |——index.js                  服务核心文件
- |——package-lock.json
- |——package.json              npm安装所有的包依赖
- |——node_modules              所有包依赖的模块放置的文件夹（需要使用npm install 获得）

从github克隆（clone）下来后，第一步，需要再此文件夹目录（common）下，运行命令：` npm install `

test                           这是一个模范使用这个服务的测试服务
- |——api                       这是放置api接口文件的地方，也是路- 由文件的集中地
- |——|——v1                     用于版本控制
- |——|——|——xxx.js              接口路由文件
- |——|——v2
- |——|——.....
- |——config                    运行服务的所有配置文件（所有的配置- 文件均是json文件）
- |——|——dev                    开发配置文件夹（文件夹里面的配置文- 件跟生产一样，配置信息不一样）
- |——|——loc                    本地配置文件夹（也属开发）（文件夹- 里面的配置文件跟生产一样，配置信息不一样）
- |——|——router.js              路由文件配置（重要）
- |——|——contants.js            常量文件配置（默认里面的配置为空）
- |——|——index.js               注配置（非常重要的一个文件，里面有mysql、redis、mongodb等的重要配置
- |——|——.......                其他配置文件
- |——logics                    业务逻辑处理文件夹
- |————v1                      业务逻辑的v1版本对应路由的v1文件夹
- |——models                    模型操作
- |——public                    静态资源文件夹，一般用于存放模本文件
- |——app.js                    加载核心服务文件
- |——index.js                  启动服务文件

# 模块的选用

1. mysql使用 Knex 模块组件
> ask：为什么使用这个 `knex` ，而不是 `sequelize` 或者 原生 `mysql` 呢？

> answer：使用原生 `mysql` 对于快速，敏捷开发来说太耗费时间了，对一些数据的操作也要耗费时间去处理才能将之实现成原生能接收的数据类型；使用 `sequelize` 对于习惯操作PHP的phper来说，查询等的链式操作，不太合适phper的开发习惯，而且相对来说会比较庞大一点。使用 `knex` ，摒弃上面所列举到几个缺点，同时又拥有两个模块的优点，对于敏捷开发足够了。 `https://knexjs.org/#Installation-node`

2. redis使用 `ioredis` 模块组件
> ask：为什么使用 `ioredis` ，而不使用  `redis` 呢？

> answer：其实 `ioredis` 与 `redis` 使用方法类似，`ioredis` 是一个功能强大，功能齐全的Redis客户端，用于世界上最大的在线商务公司阿里巴巴和许多其他令人敬畏的公司。 `https://github.com/luin/ioredis/blob/master/API.md#new_Redis`


# 编码规范

1. 所有的公共方法使用驼峰命名法，禁止使用拼音标识（ 如：getList() ）
2. 禁止使用不规范的英文缩写（如：October ->  Octo）
3. 禁止模凌两可的命名多个变量名
4. 变量使用下划线（_）分开
5. 代码缩进一致，统一使用（tab或者空格 `4` 进行缩进）
6. 不能使用 `关键字` 充当变量
7. 尽量不要在模块中使用 `var` 变量

# 注释规范

1. 方法体的的注释，类的注释，如下

```
/**
 * 这是注释内容，最好可以将参数如下补充完整
 * @param   {string}  name    名称
 */
function name (name) {
    return 1;
}
// 参考规范 https://www.kancloud.cn/chandler/css-code-guide/50867
```

# 文件新建规范

1. models文件夹主要放置mysql数据库操作的文件夹，里面所有的文件将以 `xxxx_model.js` 结尾，当然为防止文件名过长，在起名应该注意好长度， `models` 文件下的所有的操作均已数据库的sql有关，不涉及业务逻辑，可以使用代码复用得到充分利用。
2. logics业务逻辑文件夹主要是放置处理以及整合数据的文件夹，里面所有的文件将以 `xxxx_logic.js` 结尾，当然为防止文件名过长，在起名应该注意好长度， `logics` 只处理业务逻辑和数据整合，不得在不得已情况下出现 `model` 的操作。
3. 应该还有一个迁移数据库表的一个文件夹的 `tables` 待定...
4. 文件命名应该在合理范围之内
