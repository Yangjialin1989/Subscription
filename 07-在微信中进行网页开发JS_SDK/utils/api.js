/*
*
* */

//地址前缀
const prefix = 'https://api.weixin.qq.com/cgi-bin/';

module.exports = {
    accessToken: `${prefix}token?grant_type=client_credential`,
    tictet: `${prefix}ticket/getticket?`,
    menu: {
        create: `${prefix}menu/create?`,
        delete: `${prefix}menu/delete?`
    }
}


