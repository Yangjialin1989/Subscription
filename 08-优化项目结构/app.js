//引入express模块
const express = require('express');

//引入路由器模块
const router = require('./router');

//创建app应用对象
const app = express();

//引入wechat模块
const Wechat = require('./wechat/wechat');

//配置模板资源目录 一定要加./views,否则报错:Error: Failed to lookup view "search" in views directory "/views"
app.set('views','./views');

//配置模板引擎
app.set('view engine','ejs');

//加载页面模块
const menu = require('./wechat/menu');


//创建Wechat实例对象
const wechatApi = new Wechat();

// wechatApi.deleteMenu();
// wechatApi.createMenu(menu);




// 应用路由
app.use(router);


//4.监听端口号
app.listen(3000,() => console.log('服务器启动成功了!'));