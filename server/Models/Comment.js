// Схема для комментариев
var mongoose = require("mongoose");
var commentSchema = mongoose.Schema({
    text:String,
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    post:{
      type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'  
    },
    author_email: String,
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Comment', commentSchema);
