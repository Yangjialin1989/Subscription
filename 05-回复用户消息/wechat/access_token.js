/*
* 获取access_token 调用全局接口的唯一凭证
*  1.有效期: 7200s,提前刷新
        *https请求方式: GET https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET
        参数	是否必须	说明
        grant_type	是	获取access_token填写client_credential
        appid	是	第三方用户唯一凭证
        secret	是	第三方用户唯一凭证密钥，即appsecret
*
*  2.思路:
*    1.首次获取,后保存为本地文件
*    2.第二次后,先读取本地,过期,重新获取,覆盖原文件;没过期直接使用
*
*  3.最终: 定义四个方法 在类里面定义四个方法
*     读取本地文件                      readAccessToken()
*          (1)有文件:判断是否过期        isValidAccessToken()
*               A过期:重新获取,覆盖原文件 getAcccessToken()
*                                     saveAccessToken()
*               B没过期:直接使用
*          (2)没有文件(第一种场景,首次获取):
* */
//引入fs模块
const {writeFile, readFile} = require('fs');

//引入request-promise-native,用来Ajax请求
const rp = require('request-promise-native')

//导入配置数据
const {appID, appsecret} = require('../config')

class Wechat {
    constructor() {

    }

    /*获取access_token*/
    getAccessToken() {
        //定义请求地址
        const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appID}&secret=${appsecret}`;
        //服务器端无法发送Ajax请求,需要使用request,request-promise-native库(使用原生node.js包装的库,可以让返回值是promise对象,保证执行没有问题)实现

        return new Promise((resolve, reject) => {
            rp({method: 'GET', url, json: true})
                .then(res => {
                    console.log(res);
                    // {
                    //     access_token: '51_GpmAmGO_0X_l6goi76F2G6gTrNIfHwG2dxXQbRzKeYjrLazb_KehabaO-fY68Uqci62LcEQv4fdLsIVp0UDWORhl9khsr8llMshYYbbYpQyog2hDJk_ij1p9cnYFpojgGoU7L6ZSVIJiv6HsPVLiAJATZP',
                    //         expires_in: 7200
                    // }
                    //设置access_token的过期时间
                    res.expires_in = Date.now() + (res.expires_in - 300) * 1000;
                    //将对象返回出去,将Promise对象状态改为成功
                    resolve(res);

                })
                .catch(err => {
                    console.log(err);
                    reject('getAccessToken方法出现问题.' + err);
                })
        })
    }

    /*
       保存access_token
    *     @param   accessToken  要保存的凭据

    */
    saveAccessToken(accessToken) {

        return new Promise((resolve, reject) => {
            //将对象转换成json字符串
            accessToken = JSON.stringify(accessToken);
            //将access_token保存一个文件
            writeFile('./accessToken.txt', accessToken, err => {
                if (!err) {
                    console.log('文件保存成功!');
                    resolve();
                } else {
                    reject('saveAccessToken方法出了问题,' + err);
                }
            })
        })
    }

    /*读取本地文件中的access_token*/
    readAccessToken() {
        return new Promise((resolve, reject) => {
            readFile('./accessToken.txt', (err, data) => {
                if (!err) {
                    console.log('文件读取成功!');
                    //将字符串转换json
                    data = JSON.parse(data);
                    resolve(data);
                } else {
                    reject('readAccessToken方法出了问题,' + err);
                }
            })
        })
    }

    /*判断access_token方法*/
    isValidAccessToken(data) {
        //检测传入的参数是否有效
        if (!data && !data.access_token && !data.expires_in) {
            return false;
        }

        //检测access_token是否在有效期内
        // if (data.expires_in < Date.now()) {
        //     //过期了
        //     return false;
        // } else {
        //     //没有过期
        //     return true;
        // }

        return data.expires_in > Date.now();
    }

    //获取没有过期的access_token @return { Promise<any>} 返回包装成Promise对象的access_token.
    fetchAccessToken() {

        //优化
        if (this.access_token && this.expires_in && this.isValidAccessToken(this)) {
            //之前保存过access_token并且有效,可以直接使用
            return Promise.resolve({
                access_token: this.access_token,
                expires_in: this.expires_in
            })
        }

        //完整逻辑
        return this.readAccessToken()
            .then(async res => {
                //本地有文件
                //判断是否过期
                if (this.isValidAccessToken(res)) {
                    //有效
                    return Promise.resolve(res);
                    //resolve(res);
                } else {
                    //过期
                    const res = await w.getAccessToken();

                    //保存下来(本地文件)
                    await this.saveAccessToken(res);

                    //将请求回来的access_token返回出去
                    resolve(res);
                }
            })
            .catch(async err => {
                //本地没有文件,重新获取
                const res = await w.getAccessToken();

                //保存下来(本地文件)
                await this.saveAccessToken(res);

                //将请求回来的access_token返回出去
                return Promise.resolve(res);
            })
            .then(res => {
                //将access_token挂载到this上,箭头函数对象是最外层的实例对象
                this.access_token = res.access_token;
                this.expires_in = res.expires_in;

                //返回res包装一层Promise成功对象
                return Promise.resolve(res);
            })
    }
}

//模拟测试
const w = new Wechat();

w.fetchAccessToken()
    .then(res => {
        console.log(res);
    })




