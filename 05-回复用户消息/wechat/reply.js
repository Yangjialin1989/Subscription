/*
* 处理用户发送的消息类型和内容options
* text,image,voice,music,video,news
* */

module.exports = message => {
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
        } else if (message.Content === '2') {
            content = '落地成河!';
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
        options.msgType = 'event';
        //用户订阅/取消订阅事件
        if (message.Event === 'subscribe') {
            //用户订阅
            content = '欢迎您的关注!'
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
            content =  `您点击了按钮:${message.EventKey}`;
        }
    }

    //
    options.content = content;
    console.log('option:'+options.content,options.fromUserName);
    //最终回复用户的消息

    return options
}
