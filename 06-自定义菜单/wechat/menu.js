/*
* 自定义菜单
* */

module.exports = {
    "button":[
        {
            "type":"click",
            "name":"寺庙简介",
            "key":"INTRODUCTION"
        },
        {
            "name":"法脉传承",
            "sub_button":[
                {
                    "type":"view",
                    "name":"跳转连接",
                    "url":"http://www.baidu.com"
                },
                {
                    "type":"click",
                    "name":"赞一下我们",
                    "key":"V1001_GOOD"
                },{
                    "type": "scancode_waitmsg",
                    "name": "扫码带提示",
                    "key": "rselfmenu_0_0"
                },
                {
                    "type": "scancode_push",
                    "name": "扫码推事件",
                    "key": "rselfmenu_0_1"
                },
                // {
                //     "type": "media_id",
                //     "name": "点击按钮会发送图片",
                //     "media_id": "MEDIA_ID1"
                // },
                // {
                //     "type": "view_limited",
                //     "name": "图文消息",
                //     "media_id": "MEDIA_ID2"
                // },
                ]
        },
        {
            "name": "发图",
            "sub_button": [
                {
                    "type": "pic_sysphoto",
                    "name": "系统拍照发图",
                    "key": "rselfmenu_1_0"
                },
                {
                    "type": "pic_photo_or_album",
                    "name": "拍照或者相册发图",
                    "key": "rselfmenu_1_1"
                },
                {
                    "type": "pic_weixin",
                    "name": "微信相册发图",
                    "key": "rselfmenu_1_2"
                }
            ]
        },
    ]
}

