const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { userValidationRules, loginValidationRules ,  validate } = require('../middleware/validator');


router.post('/register',  
    userValidationRules() , validate , 
    userController.postRegister);
router.post('/login', 
    loginValidationRules() , validate , 
    userController.postLogin);
router.post('/resetPass', userController.postResetPassword);

router.get('/reset/:token' , userController.getResetPass);

module.exports = router;
