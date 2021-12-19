/*
*
*
* */
//
const db = require('../db');
const theatersCrawler = require('./crawler/theatersCrawler');
const saveTheaters = require('./save/saveTheaters');

(async () => {
    //连接数据库
    await db;

    //查询数据
    const data = await theatersCrawler();

    //爬取的数据保存到数据库中
    await saveTheaters(data);



})();












