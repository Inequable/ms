# ms

这是一个有express搭建而成的服务

这是所有服务的一个核心框架所在
common                      核心文件夹
|——connector                数据库单例文件夹
|————basemodel.js           sequelize ORM 单例封装（主要操作mysql）
|————database.js            mysql 使用原生的（也是操作mysql）建议不用
|————mongodb.js             mongodb单例封装以及实现简单的dao操作
|————redis.js               redis单例封装
|——index.js                 服务核心文件
|——package-lock.json
|——package.json             npm安装所有的包依赖
|——node_modules             所有包依赖的模块放置的文件夹（需要使用npm install 获得）

从github克隆（clone）下来后，第一步，需要再此文件夹目录下，运行命令：npm install

test                        这是一个模范使用这个服务的测试服务
|——api                      这是放置api接口文件的地方，也是路由文件的集中地
|————v1                     用于版本控制
|——————xxx.js               接口路由文件
|————v2
|————.....
|——config                   运行服务的所有配置文件（所有的配置文件均是json文件）
|————dev                    开发配置文件夹（文件夹里面的配置文件跟生产一样，配置信息不一样）
|————loc                    本地配置文件夹（也属开发）（文件夹里面的配置文件跟生产一样，配置信息不一样）
|————access.js              权限文件，目前有一个键是白名单策略（重要）
|————database.js            mysql配置文件（次选）
|————monogodb.js            mongodb配置文件（次选）
|————redis.js               reids配置文件（次选）
|————router.js              路由文件配置（重要）
|————sys.js                 服务运行的系统参数配置（重要）
|————.......                其他配置文件
|——logic                    业务逻辑处理文件夹
|——model                    模型操作
|——app.js                   加载核心服务文件
|——index.js                 启动服务文件
