/*
   用户给微信服务器  message

* 处理用户发送的消息message类型和内容options
* text,image,voice,music,video,news
* */


const axios = require('axios');
var events = require('events');

//引入rp
const rp = require('request-promise-native');

//引入模型对象
const Theaters = require('../model/Theaters');
//引入数据库
var mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/suscription", {useUnifiedTopology: true, useNewUrlParser: true});

//引入config 中的url
const {url} = require('../config');

module.exports = async message => {
    let options = {
        toUserName: message.FromUserName,
        fromUserName: message.ToUserName,
        createTime: Date.now()
    };
    //console.log('reply.message'+message.MsgType)
    let content = '您在说什么,我听不懂哦?';
    //判断是否是text消息类型
    if (message.MsgType === 'text') {
        //判断消息内容?
        options.msgType = 'text';
        if (message.Content === '首页') {


            content = '大吉大利,今晚吃鸡!';
        } else if (message.Content === '热门') {
            //回复图文列表
            //查询数据库数据 await 等待
            //console.log(message);
            //const data = Theaters.find({},{title: 1,score: 0, casts: 0, href: 0,genre: 0,summary: 1,image: 1,_id: 0,createTime: 0});
            //console.log('hhhh')
            const data = await Theaters.find({}, {title: 1, summary: 1, image: 1, _id: 0, id: 1,});
            content = [];
            //设置回复用户数据类型
            options.msgType = 'news';

            //遍历,将数据添加进去
            for (var i = 0; i < 3; i++) {
                let item = data[i];
                content.push({
                    title: item.title,
                    description: item.summary,
                    picUrl: item.image,
                    url: `${url}/detail/${item.id}`
                })
            }


        } else if (message.Content.match('爱')) {//包含爱的字句回复我爱你
            content = '我爱你!';
        } else {
            console.log(message.Content);
            const str = encodeURI('${message.Content}')
            //搜索用户输入的指定天气信息
            //const url = `https://v0.yiketianqi.com/api?unescape=1&version=v9&appid=84532775&appsecret=I2l6vzON&city=${str}&callback=?`;
            const url = 'https://v0.yiketianqi.com/api';
            const {data} = await rp({
                method: 'GET',
                url,
                json: true,
                qs: {city: message.Content, unescape: 1, version: 'v9', appid: 84532775, appsecret: 'I2l6vzON'}
            });
            console.log(data);
            if (data && data.length) {
                //有数据,返回离别
                //遍历,将数据添加进去
                content = [];
                options.msgType = 'news';
                for (var i = 0; i < 3; i++) {
                    let item = data[i];
                    content.push({
                        title: `${message.Content}天气`,
                        description: `${item.day},${item.date},${item.week},${item.wea_day},${item.tem1}℃,${item.air_level},${item.air_tips}`,
                        picUrl: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%253A%252F%252Fdingyue.ws.126.net%252F2021%252F0609%252Fd8653e3fj00qufsfn0023c000m800g6g.jpg%26thumbnail%3D660x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1642506553&t=590b0f29596b3735ed2d41721e6efb03',
                        url: 'http://www.baidu.com'
                    })
                }

            } else {
                content = '暂时无法查询到,请核对您输入的城市,无需包含(市/县)!'
            }

        }
    } else if (message.MsgType === 'image') {
        //用户发送图片消息
        options.msgType = 'image';
        options.mediaId = message.MediaId;
        console.log(message.PicUrl);
    } else if (message.MsgType === 'voice') {
        //用户发送语音消息
        options.msgType = 'voice';
        options.mediaId = message.MediaId;
        //语音识别结果,需要在接口权限表中开启语音识别结果功能
        console.log(message.Recognition);
    } else if (message.MsgType === 'location') {
        options.msgType = 'location';
        content = `纬度: ${message.Location_X} 经度: ${message.Location_Y} 地理位置信息: ${message.Label}`;

    } else if (message.MsgType === 'event') {
        //options.msgType = 'event';
        //用户订阅/取消订阅事件
        if (message.Event === 'subscribe') {
            //用户订阅
            options.msgType = 'text';
            content = '欢迎您的关注!\n' +
                '回复 首页 能看到电影预告片\n' +
                '回复 热门 能看到最热门的电影\n' +
                '回复 国内城市名称,查天气\n' +
                '也可以点击下面的按钮,了解公众号';


            if (message.EventKey) {
                content = '用户扫描了带参数的二维码关注事件';
            }
        } else if (message.Event === 'unsubscribe') {
            //用户取消订阅
            console.log('用户取消关注!')
        } else if (message.Event === 'SCAN') {
            content = '用户已经关注过,再扫描带参数的二维码关注事件';
        } else if (message.Event === 'LOCATION') {
            options.Event = 'LOCATION';
            content = `纬度: ${message.Latitude} 经度: ${message.Longitude} 地理位置信息: ${message.Precision}`;

        } else if (message.Event === 'CLICK') {
            content = '您可以按照以下提示进行操作!\n' +
                '回复 首页 能看到电影预告片\n' +
                '回复 热门 能看到最热门的电压\n' +
                '回复 语音 可以查到电影信息\n' +
                '也可以点击下面的按钮,了解公众号';
        }


    }

    //
    options.content = content;
    console.log('option:' + options.content);
    //最终回复用户的消息

    return options

}
