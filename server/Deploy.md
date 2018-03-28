# 此文档是用于给用于部署web页面的步骤

###建议npm的部分使用cnpm进行替代
0. 安装依赖
   Node组件（普通情况下，建议使用nodejs.org中的二进制包，version>= 8.4.0）
   mongodb (version>= 3.4.0)
   redis (version>= 3.10.0)

1. 前端部分启动
   随后端一起启动，不需要单独处理
   但是需要单独分开整理：
   进入app 和 app_phone 目录，使用npm install(cnpm install)
   当安装完成后，使用npm run build(cnpm run build)进行前端项目的打包工作
   然后把生成的dist目录重命名为对应的目录名（如app，把dist目录修改为app）然后放到server目录里面
   目前在linux部分build会失败，正在找原因。

2. web后台部分
   0. 修改在argus-web/server/start_config.js里面对应的配置
   1. 跳转到server 然后使用npm install(cnpm install)
   2. 当步骤一运行完之后，运行npm run start(cnpm install)



