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


//引入request-promise-native,用来Ajax请求
const rp = require('request-promise-native')

//引入menu模块
const menu = require('./menu');

//导入配置数据
const {appID, appsecret} = require('../config')

//导入api模块
const api = require('../utils/api');

//导入tool工具函数
const {writeFileAsync,readFileAsync} = require('../utils/tool');

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
                    console.log('getAccessToken:'+res);
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
       return writeFileAsync(accessToken,'./access_token.txt');
    }

    /*读取本地文件中的access_token*/
    readAccessToken() {
        return readFileAsync('./access_token.txt');
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

    //创建菜单
    createMenu (menu) {
        return new Promise(async (resolve,reject) => {
            //async不可用解决异常,需要try,catch解决异常
            //异常捕获
            try {
                //获取access_token
                const data = await this.fetchAccessToken()
                //const data = '52_mxakv-puJuIKW3hj8pjSHfAuOxrZB9yvRusiZSFJsJSZIe6PHLccXjinb6NJ6d-4YZdp5ZFAv5nofPRqgcJXB9P5IuQv0-T69aUvTu_e-I47r_MtXWQqsRhhQtTPRyTjHLnMROd2ZPIwMtegWRZjAHANIQ';

                //定义请求地址
                const url = `https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${data.access_token}`;
                //发送请求
                const result = await rp({method: 'POST', url, json: true, body: menu});
                //将result返回出去
                resolve(result);
            } catch (e) {
                //抛出异常
                reject('createMenu方法出现问题:'+e);
            }
        })
    }

    //删除菜单
    deleteMenu () {
        return new Promise(async (resolve,reject) => {
            try {
                //获取access_token
                const data = await this.fetchAccessToken()
                // const data = '52_mxakv-puJuIKW3hj8pjSHfAuOxrZB9yvRusiZSFJsJSZIe6PHLccXjinb6NJ6d-4YZdp5ZFAv5nofPRqgcJXB9P5IuQv0-T69aUvTu_e-I47r_MtXWQqsRhhQtTPRyTjHLnMROd2ZPIwMtegWRZjAHANIQ';
                console.log(data)
                //定义请求地址
                const url = `https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=${data.access_token}`;

                //发送请求
                const result = await rp({method: 'GET', url, json: true});

                //返回
                resolve(result);
            } catch (e) {
                reject('deleteMenu方法出现错误:'+e);
            }

        })
    }

    //获取JS-SDK jsapi_ticket
    /*获取*/
    getTicket() {

        return new Promise(async (resolve, reject) => {

            //获取access_token
            const data = await this.fetchAccessToken();
            //定义请求地址
            const url = `${api.tictet}access_token=${data.access_token}&type=jsapi`;
            //服务器端无法发送Ajax请求,需要使用request,request-promise-native库(使用原生node.js包装的库,可以让返回值是promise对象,保证执行没有问题)实现
            console.log(url);

            rp({method: 'GET', url, json: true})
                .then(res => {
                    resolve({
                        ticket: res.ticket,
                        expires_in: Date.now() + (res.expires_in - 300) * 1000
                    });
                })
                .catch(err => {
                    console.log(err);
                    reject('getTicket方法出现问题.' + err);
                })
        })
    }

    /*
       保存
    *     @param   ticket  要保存的凭据

    */
    saveTicket(ticket) {
        return writeFileAsync(ticket,'./ticket.txt');
    }

    /*读取本地文件中的*/
    readTicket() {
        return readFileAsync('./ticket.txt');
    }

    /*判断方法*/
    isValidTicket(data) {
        //检测传入的参数是否有效
        if (!data && !data.ticket && !data.expires_in) {
            return false;
        }
        return data.expires_in > Date.now();
    }

    //获取没有过期的ticket @return { Promise<any>} 返回包装成Promise对象的access_token.
    fetchTicket() {

        //优化
        if (this.ticket && this.ticket_expires_in && this.isValidTicket(this)) {
            //之前保存过ticket并且有效,可以直接使用
            return Promise.resolve({
                ticket: this.ticket,
                expires_in: this.expires_in
            })
        }

        //完整逻辑
        return this.readTicket()
            .then(async res => {
                //本地有文件
                //判断是否过期
                if (this.isValidTicket(res)) {
                    //有效
                    return Promise.resolve(res);
                } else {
                    //过期
                    const res = await w.getTicket();

                    //保存下来(本地文件)
                    await this.saveTicket(res);

                    //将请求回来的ticket返回出去
                    return Promise.resolve(res);
                }
            })
            .catch(async err => {
                //本地没有文件,重新获取
                const res = await w.getTicket();

                //保存下来(本地文件)
                await this.saveTicket(res);

                //将请求回来的access_token返回出去
                return Promise.resolve(res);
            })
            .then(res => {
                //将ticket挂载到this上,箭头函数对象是最外层的实例对象
                this.ticket = res.ticket;
                this.ticket_expires_in = res.expires_in;

                //返回res包装一层Promise成功对象
                return Promise.resolve(res);
            })
    }



}


//立即执行函数
// (async () => {
//     //模拟测试
//     const w = new Wechat();
//     //菜单测试
//     // //删除之前定义的菜单
//     // let result = await w.deleteMenu();
//     // console.log(result);
//     //
//     // //创建新的菜单
//     // let result1 = await w.createMenu(menu);
//     // console.log(result1);
//
//     //获取ticket测试
//     const data = await w.fetchTicket();
//     console.log(data);
//
//
// })()
const w = new Wechat();
//
// w.fetchTicket()
//     .then(res => {
//         console.log(res);
//     })
//暴露接口
//     删除之前定义的菜单

//
//w.deleteMenu().then(r => console.log(r));
//w.createMenu(menu).then(r => console.log(r));
//     //创建新的菜单




module.exports = Wechat;

