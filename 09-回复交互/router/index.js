/*
* 路由器
*
* */

const express = require('express');
//y引入sha1模块
const sha1 = require('sha1');

//引入ejs模块
const ejs = require('ejs');

//引入reply验证模块
const reply = require('../reply');

//引入wechat模块
const Wechat = require('../wechat/wechat');

//创建Wechat实例对象
const wechatApi = new Wechat();

//引入配置文件(解构赋值)
const {url} = require('../config');
//获取Router
const Router = express.Router;

//创建路由器对象
const router = new Router();

//引入数据model
const Theaters = require('../model/Theaters');

//查询页面
router.get('/search', async (req,res) => {
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

//详情页面
router.get('/detail/:id',async (req,res) => {
    //获取占位符id的值
    const {id} = req.params;
    console.log(id);
    //判断id值是否存在
    if (id) {
        //去数据库中找到对应id值的数据,渲染到页面上
        const data = await Theaters.findOne({id:id},{genre: 1,href: 1,title: 1,director: 1,casts: 1,image: 1,score: 1,summary: 1});
        console.log(data);

        //渲染到页面上
        res.render('detail',{data});

    } else {
        res.end('err');
    }


})

//调用中间件
router.use(reply());

//暴露路由器
module.exports = router;