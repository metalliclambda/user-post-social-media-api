const mongoose = require('mongoose');
const jwt = require("jsonwebtoken")
process.env.JWT_PRIVATE_KEY = "This Should be A Secret in Env";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        unique : true,
        required: true,
    },
    password : {
        type : String,
        required : true
    },
    email : {
        type : String,
        unique : true,
        required : true
    },
    passResetToken : {
        type : String
    }

});

userSchema.methods.generateToken = function(){
    return jwt.sign({_id : this._id} , process.env.JWT_PRIVATE_KEY);
}

module.exports = mongoose.model('User', userSchema);
