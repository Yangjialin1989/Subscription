/*
* 保存数据功能
*
* */
//引入数据模型Theaters
const Theaters = require('../../model/Theaters');


module.exports = async data => {

    for(var i=0;i<data.length;i++){
        let item = data[i];
        const result = await Theaters.create({
            id: item.id,
            title: item.title,
            runtime: item.runting,
            score: item.score,
            director: item.director,
            casts: item.casts,
            href: item.href,
            image: item.image,
            genre: item.genre,
            summary: item.summary
        })
        //console.log('数据保存成功');

    }


}





