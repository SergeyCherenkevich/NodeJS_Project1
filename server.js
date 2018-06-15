var express = require("express");
var bodyparser = require("body-parser");
var mongoose = require("mongoose");//Библиотека для работы с mongoDb

var morgan = require("morgan");// Библиотека для организации логирования


mongoose.connect('mongodb://localhost:27017/test');
var cookieParser = require("cookie-parser"); //Сохраняем данные о сессии, например


var app = express(); // Используем все методы framework express

var Post = require("./server/Models/Post");
var User = require("./server/Models/user");
var morgan = require("morgan");
var session = require("express-session");
var mongoStore = require("connect-mongo")(session);
var Comment = require("./server/Models/Comment");
var Like = require("./server/Models/Like");

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var multer = require("multer");
var path = require("path");
var fs = require("fs");
var upload = multer({dest: 'public/content'});

app.use(session({
    secret: 'secret',
    key: 'key',
    resave: true,
    saveUninitialized: true,
    store: new mongoStore({
        mongooseConnection: mongoose.connection
    })
}));



// npm passport - для сохранения и работы с данными пользователя в сессии

// var post = new Post({
//     title: 'Title 1',
//     content: 'Content 1',
//     author: 'Sergey'
// });


// post.save(function(err,post){
//     if (err) console.log(err);
//     console.log(post);
// })

app.use(morgan('dev'));


app.use(bodyparser.json({limit:5200000000})); //Показываем, что мы ожидаем json и преобразует в json любой входящий формат
app.use(bodyparser.urlencoded({extended:true}));
app.use(cookieParser())
app.use(express.static('./public'));//статичная страница для обновления 

passport.use(new LocalStrategy({usernameField: 'email' },
    function( email, password, done) {
       User.findOne({ email: email }).exec(function(err, user) {
            if (err) return done(err);
            if (!user) return done(null, false);
            user.comparePassword(password, function(err, isMatch) {
                if (err) return done(err);
                if (isMatch) return done(null, user);
                return done(null, false);
            });
        });
}));

passport.serializeUser(function(user, done) {
    // console.log("serializeUser", user);
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id).exec(function(err, user) {
        // console.log("deserializeUser", user);
        done(err, user);
    });
});
app.use(passport.initialize());
app.use(passport.session());

// Use of Passport user after login

app.use(function(req, res, next) {
  if (req.user) {
      res.cookie('user', JSON.stringify(req.user));
  }
  next();
});

app.post('/api/logout', function(req, res, next) {
  req.logout();
  res.clearCookie('session');
  res.status(200).end();
});

app.post('/api/signup', function(req, res, next){
  var user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });
  
  user.save(function(err){
    req.login(user, function(err){
      return res.json(user);
    })
  });
  
});

app.post('/api/login', passport.authenticate('local'), function(req, res){
  res.send(req.user);
});


app.get('/',function(req,res,next){
    res.send('Hello World!!!');
    
});
app.get('/:name', function(req,res,next){
    res.send(req.params.name);
});//pas параметр (url/name)
// query параметр (url?name=sergey) --Пока забудем об этом

app.get('/api/post', function(req, res, next) {
    Post.find().populate('likes').exec(function(err, posts){
        if (err) return res.send(400);
        res.send(posts);
    })
});

app.get('/api/post/profile', function(req,res,next){
    if (req.user) {
    Post.find({author: req.user._id})
    .exec(function(err,posts){
        if(err) return res.send(400);
        res.send(posts);
    });
    } else {
        res.send(401);
    } 
})

app.post('/api/post', upload.array('file'), function(req, res, next) { //Закоментили 21.05.2018
    if (req.user) {
        console.log(req.files);
        var post = new Post({
            title : req.body.title,
            content : req.body.content,
            author: req.user._id
        })
        var currentPath = req.files[0].path;
        var ext = req.files[0].originalname.split('.').pop();
        var targetPath = path.resolve(`public/content/${post._id}.${ext}`);
        fs.rename(currentPath,targetPath, function(err) {
            if (err) return res.send(err);
               post.file = `/content/${post._id}.${ext}`;
               post.save(function(err,post){
                   if (err) return res.send(err)
                    res.send(post);
               })
        })
    
    }
     else {
         res.send(401);
     }
});

// app.post('/api/post', function(req, res, next) { //Закоментили 21.05.2018
//     if (req.user) {
//     var post = new Post({
//         title:req.body.title,
//         content:req.body.content,
//         // author:req.body.author,
//         author: req.user._id,
//         file:req.body.file
//     });
    
//     post.save(function(err,post){
//         if (err) return res.status(400).send(err);
//         res.send(post);
//     }); }
//     else {
//         res.send(401);
//     }
//     //console.log(req.body)
//     //res.send(200)
// });

app.delete('/api/post/:id',function(req, res, next){
    Post.remove({_id: req.params.id})
      .exec(function(err){
          if (err) return res.status(400).send(err);
       res.send(200);   
      })
    
    // console.log(req.params.id);
    
})

app.put('/api/post', function(req, res, next) {
    Post.findById(req.body.id)
    .exec(function(err,post){
        post.title = req.body.title;
        post.content = req.body.content;
        post.author = req.body.author;
       if (req.body.file !='') {
           post.file = req.body.file;
       }
        
        post.save(function(err,post){
            if (err) return res.status(300).send(err);
            res.send(post);
        })
    })
    });
    
app.get('/api/post/:id', function(req, res, next) {
    Post.findById( req.params.id)
        .populate('comments')
        .exec(function(err, post){
        if (err) return res.send(400);
        res.send(post);
       
    })
});
    
app.post('/api/comment/:post_id', function(req,res,next){
    if (req.user) {
       Post.findById(req.params.post_id)
       .exec(function(err,post){
           if (err) return res.send(err);
           var comment = new Comment({
               text: req.body.text,
               post:post._id,
               author_email: req.user.email,
               author: req.user._id
           });
           comment.save(function(err){
               if (err) return res.send(err);
               post.comments.push(comment);//Добавить в массив
               post.save(function(err){
                   if (err) return res.send(err);
                   res.send(comment);
               })
           })
       } )
    } else {
        res.send(401);
    }
})  

app.post('/api/delcomment/:id', function(req,res,next){
    if (req.user) {
       Comment.remove({_id: req.params.id})
       .exec(function(err,comment){
           if (err) return res.send(err);
        Post.findById(req.body.post_id) 
        .exec(function(err,post){
            if (err) return res.send(err);
              post.comments = post.comments.filter(function(item){
                  return item !==req.params.id;
              });
              post.save(function(err){
                   if (err) return res.send(err);
                   res.send(200);
               });
        });
           
       });       
    } else {
        res.send(401);
    }
})

app.post('/api/like/:id', function(req, res, next) {
   if(req.user) {
     Like.count({user: req.user._id, post: req.params.id})
      .exec(function(err, count) {
        if(err) return res.send(err)
        if(count==0) {
            console.log('AddLike');
            console.log(req.user._id);
          var like = new Like({
            user: req.user._id,
            post: req.params.id
          })
          like.save(function(err, like) {
            if(err) return res.send(err);
            Post.findById(req.params.id).exec(function(err, post) {
                if(err) return res.send(err);
                post.likes.push(like);
                post.save(function(err, post) {
                  if(err) return res.send(err);
                  res.send(post);
                })
            })
          })
        } else {
          Like.remove({user: req.user._id, post: req.params.id})
            .exec(function(err, like) {
                console.log('remove');
              if(err) return res.send(err);
              Post.findById(req.params.id)
                .exec(function(err, post) {
                    if(err) return res.send(err);
                    post.likes = post.likes.filter(function(like) {
                      return like !== like._id
                    })
                    post.save(function(err, post) {
                      if(err) return res.send(err);
                      res.send(post);
                    })
                })
            })
        }
      })
   } else {
     res.send(401);
   }
});
// app.post('/api/login', function(req,res,next){
//     if (req.body.email=='admin@gmail.com' && req.body.password=='admin') {
//         var session = {email:req.body.email};
//         res.cookie('session', JSON.stringify(session));
//         res.send(200);
//     } else {
//           res.status(401).send('Error!');
//     }
    
// })

// app.post('/api/logout', function(req,res,next){
//   res.clearCookie('session');
//   res.send(200);
    
// })


app.get('*', function(req,res,next){
  res.redirect('/#'+req.originalUrl);  
})// Все остальные get запросы, кроме вышеописанных, будут отправлять на домашнюю страницу
app.listen(process.env.PORT || 3000, function(){
    console.log('Express server listening on port   '+ process.env.PORT)});
