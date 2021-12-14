/*
* 工具函数包
*
*
* */
//导入库
//xml对象转换为js
const {parseString} = require('xml2js');

module.exports = {
    getUserDataAsync (req) {
        return new Promise((resolve,reject) => {
            let xmlData = '';
            //给req绑定事件
            req
                .on('data',data =>{
                    //流式数据传递过来的时候,触发,将数据注入到回调函数
                    //console.log(data);
                    //<Buffer 3c 78 6d 6c 3e 3c 54 6f 55 73 65 72 4e 61 6d 65 3e 3c 21 5b 43 44 41 54 41 5b 67 68 5f 35 32 31 35 62 62 64 38 36 30 35 31 5d 5d 3e 3c 2f 54 6f 55 73 ... 225 more bytes>
                    //读取的数据是Buffer, 转换为字符串
                    xmlData += data.toString();
                })
                //colse,end
                .on('close', () =>{
                    //console.log('close function')
                    //当数据接收完毕,触发
                    resolve(xmlData);
                    /*
                    * <xml><ToUserName><![CDATA[gh_5215bbd86051]]></ToUserName>
                        <FromUserName><![CDATA[oXKiu6jxH7FPb93gY1qHgu2za_IY]]></FromUserName>
                        <CreateTime>1639473437</CreateTime>
                        <MsgType><![CDATA[text]]></MsgType>
                        <Content><![CDATA[1]]></Content>
                        <MsgId>23471617156295792</MsgId>
                       </xml>

                    * */

                })
        })

    },

    //解析xml返回js对象
    parseXMLAsync (xmlData) {
        return new Promise((resolve,reject) => {
            parseString(xmlData,{trim: true}, (err,data) => {
                if (!err) {
                    resolve(data);
                } else {
                    reject('parseXMLASsync方法出了问题:'+err);
                }
            })
        })
    },

    //格式化数据
    formatMessage (jsData) {
        let message = {};
        //获取xml对象

        jsData = jsData.xml;
        console.log(jsData)
        //判断数据是否是一个对象
        if (typeof jsData === 'object') {
            //遍历对象
            for (let key in jsData) {
                //获取属性值
                let value = jsData[key];
                //message[key] = value[0];
                //过滤掉空数据
                if (Array.isArray(value) && value.length > 0) {
                    message[key] = value[0];
                }
            }
        }
        return message;
    }
}






