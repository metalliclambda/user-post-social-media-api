const User = require('../models/user');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const crypto = require("crypto");
const sendEmail = require('../util/send-email');
const url = require('url');



module.exports.postRegister = async (req, res, next) => {
    let { username, password, email } = req.body;
    try {

        if (await User.findOne({ email }).exec() || await User.findOne({ username }).exec()) {
            res.status(404).json({ message: "user or email already exists!" })
            return;
        }

        password = await bcrypt.hash(password, saltRounds);
        const newUser = new User({
            username,
            password,
            email
        });
        await newUser.save();
        res.status(201).json({
            message: "User Successfully Registered",
            user: {
                username,
                email,
                token: newUser.generateToken()
            }
        })

    } catch (error) {
        res.status(400).json({ message: error })
    }

}


module.exports.postLogin = async (req, res, next) => {
    let { username, password } = req.body;
    let user = await User.findOne({ username: username }).exec();
    if (!user) {
        return res.status(400).json({ message: "invalid usernameor password!" });
    }

    if (!await bcrypt.compare(password, user.password)) {
        return res.status(400).json({ message: "invalid usernameor password!" });
    }
    const token = user.generateToken();
    res.status(200).json({ token: token });

}

module.exports.postResetPassword = async (req, res, next) => {
    try {
        let { email } = req.body;
        let user = await User.findOne({ email }).exec();
        if (!user) {
            return res.status(400).json({ message: "invalid usernameor!" });
        }

        const passResetToken = crypto.randomBytes(32).toString("hex");

        user.passResetToken = passResetToken;
        await user.save();

        await sendEmail(email, 'Reset Password Email', `localhost:3000/reset/${user.passResetToken}`);
        res.status(200).json({ message: "Reset Link Sent" });

    } catch (error) {
        res.status(500).json(error);
    }

}

module.exports.getResetPass = async (req,res,next) => {
    let token = req.params.token;

    let user = await User.findOne({passResetToken : token});
    if(!user){
        return res.status(400).json({message : "Not correct token"});
    }


    res.status(200).json({message : "reset password token is correct"})

    
}
