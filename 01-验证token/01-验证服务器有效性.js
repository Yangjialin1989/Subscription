//1.引入express模块
const express = require('express');
//引入sha1模块
const sha1 = require('sha1');

//2.创建app应用对象
const app = express();

//3.验证服务器的有效性
//3.1 微信服务器要知道开发者服务器是哪个
//    URL:在测试号管理页面上填写URL开发者服务器地址,使用ngrok内网穿透,将本地端口开启的服务映射为外网可以访问的网址
//    指令 ngrok http 3000;
//    Token:自己填写
// 3.2 开发者服务器 验证消息是否来自微信服务器
      //目的:计算得出signature和微信传递过来的signature进行对比,如果一样说明来自微信服务器;
      // 算法: 1.将参与微信加密签名的三个参数(timestamp,noce,token),组合在一起,按照字典排序,并组合在一起,形成数组,将数组拼接成一个字符串)
      //      2.将数组进行sha1加密(npm i sha1)
      //      3.加密完生成signature ,和微信发来的一样就是验证成功
      //        3.1 如果一样,返回echostr给微信服务器
      //        3.2 如果不一样,返回error给微信服务器

//定义配置文件
const config = {
    token:'13696812048',
    appID :'wxbbb63c35cff0a39a',
    appsecret:'8930f0e111b0677d21a021e0043adb9a',

}


app.use((req,res,next)=>{
  //app.use() 可以接受处理所有消息
    console.log(req.query);
    // {
    //     signature  微信加密签名:     '000f1cd7ba43ff131842ed2322799797811462ad',
    //     echostr    微信的随机字符串:  '1261338858893081587',
    //     timestamp  时间戳:          '1639369585',
    //     nonce      微信的随机数字:    '243436994'
    // }
    //1.将参与微信加密签名的三个参数(timestamp,noce,token),组合在一起,按照字典排序,并组合在一起,形成数组,将数组拼接成一个字符串)
    //对象解构赋值,获取相应的数据
    const {signature,echostr,timestamp,nonce} = req.query;
    const {token} = config;
    const arr = [timestamp,nonce,token];
    const arrSort = arr.sort();
    const str = arr.join('');
    //2.将数组进行sha1加密(npm i sha1)
    const sha1Str = sha1(str);
    console.log(typeof(sha1Str),typeof(signature),echostr);
    //3.加密完生成signature ,和微信发来的一样就是验证成功
    console.log(req.method)
    if (sha1Str == signature) {
        console.log('ok')
        res.setHeader('Content-type','text/html;charset=utf-8');
        //res.setHeader('Content-type','application/x-www-form-urlencoded; charset=UTF-8');
        res.send(echostr);

        //lDYD9uxVyUxUgXBOu7ISmmPB6JjKlZupASdbXKiocOR
    } else {
        //res.setHeader('Content-type','text/html;charset=utf-8');
        res.send('error');
    }
});

//4.监听端口号
app.listen(3000,() => console.log('服务器启动成功了!'));