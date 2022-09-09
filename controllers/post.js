const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
// const { populate } = require('../models/user');
const { default: mongoose } = require('mongoose');


module.exports.getReadPosts = async (req, res, next) => {
    const posts = await Post.find().populate('postLikes' , 'username -_id').populate(
        {
            path : 'postComment',
            select : 'commentText -_id',
            populate : {
                path : 'commentUser',
                select : 'username -_id'
            }
        }        
    );
    res.status(200).json(posts);
}

module.exports.postInsertPost = async (req, res, next) => {
    try {
        let {postName , postText , postOwnerId} = req.body;
        let isIdValid = mongoose.isObjectIdOrHexString(postOwnerId);
        if(!isIdValid)
            return res.status(400).json({message : "Not correct Input"});

        let isUserValid = await User.exists({_id : postOwnerId}).exec();
        if(!isUserValid)
            return res.status(400).json({message : "Not correct Input"});
        
        let newPost = new Post({
            postName,
            postText,
            postOwnerId
        });
        await newPost.save();
        res.status(201).json(newPost);        
    } catch (error) {
        res.status(400).json(error)
    }
}

module.exports.deletePost = async (req, res, next) => {
    let postId = req.params.id;


    // let result = await Post.findByIdAndDelete(postId);
    let post = await Post.findById(postId);
    if(!post)
        return res.status(400).json({message : "Post doesnt exist"});

    if(!(req.body.userId === post.postOwnerId))
        return res.status(400).json({message : "Not authorized to do it"});
    
        
    let commentIds = post.postComment;
    await post.deleteOne();
    let commentDeteleResult = await Comment.deleteMany({_id : commentIds});
    
    res.status(200).json({deletedPost : post , deletedComments : commentDeteleResult});
}

module.exports.postEditPost = async (req, res, next) => {
    try {
        let postId = req.params.id;
        let post = await Post.findById(postId);    
        if(!post)
            return res.status(400).json({message : "Post doesnt exist"})
        
        let {postName , postText , userId} = req.body; 

        let isIdValid = mongoose.isObjectIdOrHexString(userId);
        if(!isIdValid)
            return res.status(400).json({message : "Not correct Input"});

        if(!(userId === post.postOwnerId)){
            return res.status(400).json({message : "Not authorized to do it"});
        }

        if(postName)
            post.postName = postName;
        if(postText)
            post.postText = postText;
        
        await post.save();
        res.status(201).json(post);        
    } catch (error) {
        res.status(400).json(error)
    }

}

module.exports.postLike = async (req, res, next) => {
    try {
        let postId = req.params.id;
        let userId = req.body.userId;
        let isIdValid = mongoose.isObjectIdOrHexString(userId) && mongoose.isObjectIdOrHexString(postId);
        if(!isIdValid)
            return res.status(400).json({message : "Not correct Input"});
        let post = await Post.findById(postId);
        if(!post)
            return res.status(400).json({message : "Post doesnt exist"});
        let isUserValid = await User.exists({_id : userId}).exec();
        if(!isUserValid)
            return res.status(400).json({message : "Not correct Input"});

        let isExist = post.postLikes.includes(userId);
        if(isExist)
            return res.status(400).json({message : "Already Liked it"});
        post.postLikes.push(userId);
        await post.save();
        res.status(200).json(post);        
    } catch (error) {
        res.status(400).json(error)
    }

}

module.exports.postComment = async (req, res, next) => {
    try {
        let postId = req.params.id;
        let {commentText , userId} = req.body;
        let isIdValid = mongoose.isObjectIdOrHexString(userId) && mongoose.isObjectIdOrHexString(postId);
        if(!isIdValid)
            return res.status(400).json({message : "Not correct Input"});

        let isUserValid = await User.exists({_id : userId}).exec();
        if(!isUserValid)
            return res.status(400).json({message : "Not correct User input"});

        let post = await Post.findById(postId);
        if(!post)
            return res.status(400).json({message : "Post doesnt exist"})

        let newComment = new Comment({
            commentText,
            commentUser : userId
        });
        await newComment.save();
        post.postComment.push(newComment._id);
        await post.save();
        res.status(200).json(post);        
    } catch (error) {
        res.status(400).json(error)
    }
}



