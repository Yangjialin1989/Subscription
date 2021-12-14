//验证服务器有效性 中间件函数

//引入sha1模块
const sha1 = require('sha1');

//引入工具
const {getUserDataAsync, parseXMLAsync, formatMessage} = require('../utils/tool');
//引入config模块
const config = require('../config');

module.exports = () => {
    //函数的返回值即是中间件函数,好处,当函数调用可以传递参数,
    return async (req,res,next)=>{
        const {signature,echostr,timestamp,nonce} = req.query;
        const {token} = config;
        const sha1Str = sha1([timestamp,nonce,token].sort().join(''));
        //微信服务器发送两种类型的消息给开发者服务器

        if (req.method === 'GET') {
            //1.get 验证服务器有效性
            if (sha1Str === signature) {
                res.setHeader('Content-type','text/html;charset=utf-8');
                res.send(echostr);
            } else {
                res.send('error');
            }
        } else if (req.method === 'POST') {
            //2.post微信服务器将用户发送的数据转发给开发者服务器
            //     验证消息来自微信服务器
            if (sha1Str !== signature) {
                res.end('error');
            }

            //接收请求体的数据,流式数据
            const xmlData = await getUserDataAsync(req);
            //console.log(xmlData);
            // <xml><ToUserName><![CDATA[gh_5215bbd86051]]></ToUserName> 开发者id
            //     <FromUserName><![CDATA[oXKiu6jxH7FPb93gY1qHgu2za_IY]]></FromUserName>用户openid
            //     <CreateTime>1639473594</CreateTime> 发送的时间戳
            //     <MsgType><![CDATA[text]]></MsgType> 发送消息类型
            //     <Content><![CDATA[/:8*]]></Content> 发送的内容
            //     <MsgId>23471617625295866</MsgId>    消息id
            // </xml>

            //如果开发者服务器没有返回响应微信服务器,微信服务器会发送三次请求
            //响应
            //将xml数据解析为js对象
            const jsData = await parseXMLAsync(xmlData);

            //格式化数据
            const message = formatMessage(jsData);
            //console.log(message);
            //let replayMessage = `<xml><ToUserName><![CDATA[toUser]]></ToUserName><FromUserName><![CDATA[fromUser]]></FromUserName><CreateTime>12345678</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[你好]]></Content></xml>`
            let content = '您在说什么,我听不懂哦?';
            //判断是否是text消息类型
            if (message.MsgType === 'text') {
                //判断消息内容?
                if (message.Content === '1') {
                    content = '大吉大利,今晚吃鸡!';
                } else if (message.Content === '2') {
                    content = '落地成河!';
                } else if (message.Content.match('爱')) {
                    content = '我爱你!';
                }
            }
            //最终回复用户的消息
            let replyMessage = `<xml>
                                  <ToUserName><![CDATA[${message.FromUserName}]]></ToUserName>
                                  <FromUserName><![CDATA[${message.ToUserName}]]></FromUserName>
                                  <CreateTime>${Date.now()}</CreateTime>
                                  <MsgType><![CDATA[text]]></MsgType>
                                  <Content><![CDATA[${content}]]></Content>
                                </xml>`;
            //返回响应给微信服务器
            console.log('replyMessage:'+replyMessage);
            res.send(replyMessage);

        } else {
            res.end('error');
        }


    }
}


