//引入express模块
const express = require('express');

//y引入sha1模块
const sha1 = require('sha1');

//引入ejs模块
const ejs = require('ejs');

//引入auth验证模块
const auth = require('./wechat/auth');

//引入wechat模块
const Wechat = require('./wechat/wechat');

//引入配置文件(解构赋值)
const {url} = require('./config');

//创建app应用对象
const app = express();

//配置模板资源目录 一定要加./views,否则报错:Error: Failed to lookup view "search" in views directory "/views"
app.set('views','./views');

//配置模板引擎
app.set('view engine','ejs');

//加载页面模块
const menu = require('./wechat/menu');


//创建Wechat实例对象
const wechatApi = new Wechat();

//菜单删除添加
//wechatApi.deleteMenu();
//wechatApi.createMenu(menu)
// 页面路由
app.get('/search', async (req,res) => {
    //渲染页面,将渲染号的页面返回给用户
    //开发者服务器端生成js-sdk使用的签名
    //1.组合参数: jsapi_ticket(临时票据),noncestr(随机字符串),timestamp(时间戳),url
    //2.字典排序,以"&"拼接
    //3.sha1加密,生成签名

    //随机字符串 split 字符串方法
    const noncestr = Math.random().toString().split('.')[1];

    //时间戳
    const timestamp = Date.now();

    //获取jsapi_ticket票据
    const {ticket} = await wechatApi.fetchTicket();

    //1.组合参数: jsapi_ticket(临时票据),noncestr(随机字符串),timestamp(时间戳),url
    const arr = [
        `jsapi_ticket=${ticket}`,
        `noncestr=${noncestr}`,
        `timestamp=${timestamp}`,
        `url=${url}/search`
    ];

    //2.字典排序,以"&"拼接
    const str = arr.sort().join('&');
    console.log(str);

    //3.sha1加密,生成签名
    const signature = sha1(str);

    //将最终签名渲染到页面上 res.render()传递参数


    res.render('search',{
        signature,
        noncestr,
        timestamp
    });
});

//调用中间件
app.use(auth());

//4.监听端口号
app.listen(3000,() => console.log('服务器启动成功了!'));