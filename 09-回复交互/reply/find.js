
var mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/suscription",{ useUnifiedTopology: true,useNewUrlParser: true });

const Theaters = require('../model/Theaters');
Theaters.find({},function(err,doc
){
    if(!err){
        console.log(doc);
    }else{
        console.log(err);
    }
});


