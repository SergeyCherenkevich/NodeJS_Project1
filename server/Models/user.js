var mongoose = require("mongoose");
var bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema({
    name: String,
    email: {type:String, unique: true, lowercase: true},
    password: String
});

userSchema.pre('save', function(next){
    var user = this;
    if (!user.isModified('password')) 
        return next();
    bcrypt.genSalt (10, function(err, salt){
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash){
          if (err) return next(err);
          user.password = hash;
          next();
        })
    })    
});

userSchema.methods.comparePassword = function(candidatePassword,next){
      bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
          if (err) return next(err);
          next(null, isMatch);
      })
}

module.exports = mongoose.model('User', userSchema);