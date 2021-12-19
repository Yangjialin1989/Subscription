const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://movie.douban.com/cinema/nowplaying/fushun/');
    await page.screenshot({path: 'example.png'});

    const dimensions = await page.evaluate(() => {
        const result = [];
        const $list = $('#nowplaying>.mod-bd>.lists>.list-item');

        for( let i=0;i<$list.length;i++){
            const liDom = $list[i];
            //电影id
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


            //let title = $list[0].id;
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
        return result;
    });

    console.log('Dimensions:', dimensions);




    await browser.close();


})();



