//引入express模块
const express = require('express');

//引入auth验证模块
const auth = require('./wechat/auth');

//创建app应用对象
const app = express();

//调用中间件
app.use(auth());

//4.监听端口号
app.listen(3000,() => console.log('服务器启动成功了!'));