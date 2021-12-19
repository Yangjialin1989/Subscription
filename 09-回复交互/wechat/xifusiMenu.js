/*
* 自定义菜单
* */
//导入配置文件
const {url} = require('../config');
console.log(url)
module.exports = {
    "button":[
        {
            "name":"动态",
            "sub_button":[

                {
                    "type":"click",
                    "name":"佛事安排",
                    "key":"V1001_GOOD"
                }

                ]
        },
        {
            "name": "长住",
            "sub_button": [
                {
                    "type":"click",
                    "name":"寺庙简介",
                    "key":"V1001_GOOD"
                },
                {
                    "type":"click",
                    "name":"法脉传承",
                    "key":"V1001_GOOD"
                },
                {
                    "type":"click",
                    "name":"入寺需知",
                    "key":"V1001_GOOD"
                },
                {
                    "type":"click",
                    "name":"联系方式",
                    "key":"V1001_GOOD"
                },
            ]
        },
        {
            "name": "我的",
            "sub_button": [
                {
                    "type":"click",
                    "name":"个人中心",
                    "key":"V1001_GOOD"
                },
                {
                    "type":"click",
                    "name":"在线办理",
                    "key":"V1001_GOOD"
                }

            ]
        }
    ]
}

