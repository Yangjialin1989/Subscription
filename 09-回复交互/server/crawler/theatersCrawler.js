/*
* 爬取热门电影
* */

const puppeteer = require('puppeteer');

const url = 'https://movie.douban.com/cinema/nowplaying/fushun/';

module.exports = async () => {

    //1.打开浏览器
    const browser = await puppeteer.launch({
        args: [''],
        headless: true //以无头浏览器的形式打开浏览器,没有界面显示,默认true

    });
    //2.创建tab标签页
    const page = await browser.newPage();
    //3.跳转到指定网址
    await page.goto(url, {
        waitUntil: 'networkidle2' //等待网络空闲时,加载页面
    });
    //4.等待网址加载完成,爬取数据
    //await page.screenshot({path: 'example.png'});
    //开启延时器,延时2s开始爬取数据


    const result = await page.evaluate(() => {
        //对加载好的页面进行DOM操作
        //爬虫核心代码--------------------------------

        //查询数据的数组
        const result = [];

        //获取所有热门电影的li
        const $list = $('#nowplaying>.mod-bd>.lists>.list-item');

        //取其中8条数据
        for (let i = 0; i < 8; i++) {
            const liDom = $list[i];
            //豆瓣id
            let id = $(liDom).attr('id');
            //电影标题
            let title = $(liDom).data('title');
            //电影评分
            let score = $(liDom).data('score');
            //电影片长
            let runtime = $(liDom).data('duration');
            //电影评分
            let director = $(liDom).data('director');
            //主演
            let casts = $(liDom).data('actors');
            //详情网址
            let href = $(liDom).find('.poster>a').attr('href');
            //海报
            let image = $(liDom).find('.poster>a>img').attr('src');
            result.push({
                id,
                title,
                runtime,
                score,
                director,
                casts,
                href,
                image

            })
        }


        //返回爬取数据
        return result;
    })
    //
    console.log(result);

    //遍历爬取到的8条数据
    for (var i=0;i<result.length;i++){
        //获取每一个条目信息
        let item = result[i];
        //获取电影详情页面网址
        let url = result[i].href;
        //爬取
        await page.goto(url, {
            waitUntil: 'networkidle2' //等待网络空闲时,加载页面
        });

        //爬取其他
        // 爬取页面
        let itemResult = await page.evaluate( () => {
            //内部代码相当于面对页面操作
            let genre = [];
            //类型
            const $genre = $('[property="v:genre"]');

            for(let j = 0;j<$genre.length;j++){
                genre.push($genre[j].innerText);
            }
            //简介
            //由于原文有 \n 空格,使用正则表达式 匹配,替换为空
            const summary = $('[property="v:summary"]').html().replace(/\s+/g,'');

            //添加属性
            return {
                genre,
                summary
            }
        })

        //在evaluate无法读取服务器变量,需要Promise返回对象,await函数后直接使用返回的值
        item.genre = itemResult.genre;
        item.summary = itemResult.summary;
    }

    console.log(result);

    //5.将浏览器关闭
    await browser.close();

    //最终将数据全部暴露出去
    return result;

}







