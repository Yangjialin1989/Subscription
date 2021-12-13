//验证服务器有效性 中间件函数

//引入sha1模块
const sha1 = require('sha1');

//引入config模块
const config = require('../config');

module.exports = () => {
    //函数的返回值即是中间件函数,好处,当函数调用可以传递参数,
    return (req,res,next)=>{
        const {signature,echostr,timestamp,nonce} = req.query;
        const {token} = config;
        const arr = [timestamp,nonce,token];
        const arrSort = arr.sort();
        const str = arr.join('');
        const sha1Str = sha1(str);
        if (sha1Str == signature) {
            res.setHeader('Content-type','text/html;charset=utf-8');
            res.send(echostr);
        } else {
            res.send('error');
        }
    }
}


