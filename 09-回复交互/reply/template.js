/*
* 用来加工处理最终回复用户消息的模板(xml数据)
* */
module.exports = options => {
    console.log('template.options:'+ options.content.length)
    //head
    let replyMessage = `<xml>
                        <ToUserName><![CDATA[${options.toUserName}]]></ToUserName>
                        <FromUserName><![CDATA[${options.fromUserName}]]></FromUserName>
                        <CreateTime>${options.createTime}</CreateTime>
                        <MsgType><![CDATA[${options.msgType}]]></MsgType>`;
    //body
    if (options.msgType === 'text') {
        replyMessage += `<Content><![CDATA[${options.content}]]></Content>`;
    } else if (options.msgType === 'image') {
        replyMessage += `<Image><MediaId><![CDATA[${options.mediaId}]]></MediaId></Image>`
    } else if (options.msgType === 'voice') {
        replyMessage += `<Voice><MediaId><![CDATA[${options.mediaId}]]></MediaId></Voice>`
    } else if (options.msgType === 'video') {
        replyMessage += `<Video>
                            <MediaId><![CDATA[${options.mediaId}]]></MediaId>
                            <Title><![CDATA[${options.title}]]></Title>
                            <Description><![CDATA[${options.description}]]></Description>
                          </Video>`
    } else if (options.msgType === 'music') {
        replyMessage += `<Music>
                            <Title><![CDATA[${options.TITLE}]]></Title>
                            <Description><![CDATA[${options.DESCRIPTION}]]></Description>
                            <MusicUrl><![CDATA[${options.MUSIC_Url}]]></MusicUrl>
                            <HQMusicUrl><![CDATA[${options.HQ_MUSIC_Url}]]></HQMusicUrl>
                            <ThumbMediaId><![CDATA[${options.mediaId}]]></ThumbMediaId>
                          </Music>`
    } else if (options.msgType === 'news') {
        //涉及多条,需要遍历
        replyMessage += `<ArticleCount>${options.content.length}</ArticleCount>
                           <Articles>`;
        options.content.forEach( item => {
            replyMessage += `<item><Title><![CDATA[${item.title}]]></Title>
                              <Description><![CDATA[${item.description}]]></Description>
                              <PicUrl><![CDATA[${item.picUrl}]]></PicUrl>
                              <Url><![CDATA[${item.url}]]></Url>
                            </item>`
        })
            replyMessage += `</Articles>`;
    } else if (options.msgType === 'event') {
        if (options.Event === 'LOCATION') {
            replyMessage += `<Event><![CDATA[${options.Event}]]></Event><Content><![CDATA[${options.content}]]></Content>`;
        } else if (options.Event === 'subscribe') {
            replyMessage += `<Event><![CDATA[${options.Event}]]></Event><Content><![CDATA[${options.content}]]></Content>`;

        }
    }

    //footer
    replyMessage += `</xml>`;
    console.log('template.replyMessage:'+replyMessage)
    return replyMessage;
}

