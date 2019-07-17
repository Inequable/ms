# 框架结构

这是一个有express搭建而成的服务，运行开发模式，使用命令：
` set NODE_ENV=dev && node xxx.js (windows)   export NODE_ENV=dev && node xxx.js (linux|Mac) ` 建议分开运行

这是所有服务的一个核心框架所在
- common                      核心文件夹
- |——connector                数据库单例文件夹
- |——|——basemodel.js           sequelize ORM 单例封装（主要操作- mysql）
- |——|——database.js            mysql 使用原生的（也是操作- mysql）建议不用
- |——|——mongodb.js             mongodb单例封装以及实现简单的dao- 操作
- |——|——redis.js               redis单例封装
- |——index.js                 服务核心文件
- |——package-lock.json
- |——package.json             npm安装所有的包依赖
- |——node_modules             所有包依赖的模块放置的文件夹（需要使用npm install 获得）

从github克隆（clone）下来后，第一步，需要再此文件夹目录（common）下，运行命令：` npm install `

test                        这是一个模范使用这个服务的测试服务
- |——api                      这是放置api接口文件的地方，也是路- 由文件的集中地
- |——|——v1                     用于版本控制
- |——|——|——xxx.js               接口路由文件
- |——|——v2
- |——|——.....
- |——config                   运行服务的所有配置文件（所有的配置- 文件均是json文件）
- |——|——dev                    开发配置文件夹（文件夹里面的配置文- 件跟生产一样，配置信息不一样）
- |——|——loc                    本地配置文件夹（也属开发）（文件夹- 里面的配置文件跟生产一样，配置信息不一样）
- |——|——access.js              权限文件，目前有一个键是白名单策略- （重要）
- |——|——database.js            mysql配置文件（次选）
- |——|——monogodb.js            mongodb配置文件（次选）
- |——|——redis.js               reids配置文件（次选）
- |——|——router.js              路由文件配置（重要）
- |——|——sys.js                 服务运行的系统参数配置（重要）
- |——|——.......                其他配置文件
- |——logic                    业务逻辑处理文件夹
- |——model                    模型操作
- |——app.js                   加载核心服务文件
- |——index.js                 启动服务文件

# 代码规范

1. 所有的公共方法使用驼峰命名法，禁止使用拼音标识（ 如：getList() ）
2. 禁止使用不规范的英文缩写（如：October ->  Octo）
3. 禁止模凌两可的命名多个变量名

# 文件新建规范

