var express = require("express");
var bodyparser = require("body-parser");
var mongoose = require("mongoose");//Библиотека для работы с mongoDb

var morgan = require("morgan");// Библиотека для организации логирования
var asyncMiddleware = require("./asyncMiddleware");

mongoose.connect('mongodb://localhost:27017/test');
var app = express(); // Используем все методы framework express

var Post = require("./server/Models/Post");

app.use(morgan('dev'));


app.use(bodyparser.json({limit:5200000000})); //Показываем, что мы ожидаем json и преобразует в json любой входящий формат
app.use(bodyparser.urlencoded({extended:true}));

// app.listen(process.env.PORT || 3000, function(){
//     console.log(`Express server listening on port $process.env.PORT`)});

app.use((err,req,res,next)=>{
    console.error(err.stack);
    res.status(500).send('Something broke!');
})

app.get('/api/post', asyncMiddleware(async(req,res,next)=>{
    let posts = await Post.find().exec();
    res.send(posts);
}))


app.listen(process.env.PORT || 3000, function(){
    console.log('Express server listening on port   '+ process.env.PORT)});