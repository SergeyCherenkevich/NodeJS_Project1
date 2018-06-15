var mongoose = require("mongoose");
var postSchema = mongoose.Schema({
    title:String,
    content: String,
    // author:String,
    author:{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
      
    },
    date: {
        type:Date,
        default : Date.now
    },
    file:String,
    comments:[
                {
                    type:mongoose.Schema.Types.ObjectId, 
                    ref:'Comment'
                    
                }
            ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Like'
        }
    ]
        
})

module.exports = mongoose.model('Post', postSchema);
