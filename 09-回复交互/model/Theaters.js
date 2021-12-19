/*
* 数据模型对象
*
* */
const mongoose = require('mongoose');

//获取Schema
const Schema = mongoose.Schema;

//创建约束对象 //unique 唯一
const theatersSchema = new Schema({
    id:String,
    title: String,
    runtime: Number,
    score: String,
    director: String,
    casts: String,
    href: String,
    image: String,
    genre: [String],
    summary: String,
    posterkey:String,//图片上传到七牛中
    createTime:{
        type: Date,
        default: Date.now()
    }
})

//创建模型对象
const Theaters = mongoose.model('Theaters',theatersSchema);

module.exports = Theaters;






