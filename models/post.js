const mongoose = require('mongoose');
// const jwt = require("jsonwebtoken")
// process.env.JWT_PRIVATE_KEY = "This Should be A Secret in Env";

const Schema = mongoose.Schema;

const postSchema = new Schema({
    postName: {
        type: String,
        required: true,
    },
    postText : {
        type : String,
        required : true
    },
    postOwnerId : {
        type : String,
        required : true,
        ref : 'User'
    },
    // postImageAddress : {
    //     type : String,
    //     unique : true,
    //     required : true
    // },    
    postLikes : {
        type : Array ,
        ref : 'User'   
    },
    postComment : {
        type : Array,
        ref : 'Comment'
    }
});

// userSchema.methods.generateToken = function(){
//     return jwt.sign({_id : this._id} , process.env.JWT_PRIVATE_KEY);
// }

module.exports = mongoose.model('Post', postSchema);
