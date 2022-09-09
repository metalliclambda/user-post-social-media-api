const express = require('express');
const router = express.Router();
const postController = require('../controllers/post');
// const { userValidationRules, loginValidationRules ,  validate } = require('../middleware/validator');

router.get('/all' , postController.getReadPosts);

router.post('/insert',  
    // userValidationRules() , validate , 
    postController.postInsertPost
);

router.post('/edit/:id', 
    // loginValidationRules() , validate , 
    postController.postEditPost
);

router.delete('/:id', postController.deletePost);

router.post('/like/:id' , postController.postLike);

router.post('/comment/:id' , postController.postComment);

module.exports = router;
