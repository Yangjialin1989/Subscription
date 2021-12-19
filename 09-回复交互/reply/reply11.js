/*
   用户给微信服务器  message

* 处理用户发送的消息message类型和内容options
* text,image,voice,music,video,news
* */
//引入模型对象
const Theaters = require('../model/Theaters');

module.exports =async  message => {
    let options = {
        toUserName: message.FromUserName,
        fromUserName: message.ToUserName,
        createTime: Date.now()
    };
    console.log('reply.message'+message.MsgType)
    let content = '您在说什么,我听不懂哦?';
    //判断是否是text消息类型
    if (message.MsgType === 'text') {
        //判断消息内容?
        options.msgType = 'text';
        if (message.Content === '1') {
            content = '大吉大利,今晚吃鸡!';
        } else if (message.Content === '热门') {
            //回复图文列表
            //查询数据库数据 await 等待
            //console.log(message);
            //const data = Theaters.find({},{title: 1,score: 0, casts: 0, href: 0,genre: 0,summary: 1,image: 1,_id: 0,createTime: 0});
            //console.log('hhhh')
            //const data = await Theaters.find({},{title: 1,summary: 1,image: 1});
            //Theaters.find({},{title: 1,summary: 1,image: 1});
            //const data = await Theaters.findOne({title: '误杀2'});
            Theaters.find({},function(err,docs){
                console.log('jinlaile')
                if(!err){
                    console.log(docs);
                }else {
                    console.log(err);
                }
            })

            console.log('hhhh');
            content = [];

            //设置回复用户数据类型
            options.msgType = 'news';

            //遍历,将数据添加进去
            // for (var i=0;i<data.length;i++){
            //     let item = data[i];
            //     content.push({
            //         title:item.title,
            //         description:item.summary,
            //         picUrl:item.image,
            //         url:'http://www.baidu.com'
            //     })
            // }

        } else if (message.Content.match('爱')) {
            content = '我爱你!';
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
            options.msgType = 'subscribe';
            content = '欢迎您的关注!\n'+
                '回复 首页 能看到电影预告片\n'+
                '回复 热门 能看到最热门的电压\n'+
                '回复 语音 可以查到电影信息\n'+
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
            content = '您可以按照以下提示进行操作!\n'+
                '回复 首页 能看到电影预告片\n'+
                '回复 热门 能看到最热门的电压\n'+
                '回复 语音 可以查到电影信息\n'+
                '也可以点击下面的按钮,了解公众号';
        }


    }

    //
    options.content = content;
    console.log('option:'+options.content,options.fromUserName);
    //最终回复用户的消息

    return options

}
