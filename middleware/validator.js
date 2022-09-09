const { body, validationResult } = require('express-validator');

module.exports.userValidationRules = () => {
    return [
        body('email').isEmail(),
        body('username').not().isEmpty(),
        body('password').not().isEmpty()
    ];
}

module.exports.loginValidationRules = () => {
    return [
        body('username').not().isEmpty(),
        body('password').not().isEmpty()
    ];
}

module.exports.validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    
    return res.status(422).json({ errors: errors.array() });
    // or use this :
    // const extractedErrors = []
    // errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

    // return res.status(422).json({
    //     errors: extractedErrors,
    // })
}
