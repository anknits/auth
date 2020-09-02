const Joi = require('joi');

// Sign up validation
const signUpValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(6).required(),
        email: Joi.string().required().email(),
        password: Joi.string().min(8).required()
    });
    return schema.validate(data);
}

const loginValidation = (data) => {
    const schema = Joi.object().keys({
        username: Joi.string().min(6),
        email: Joi.string().email(),
        password: Joi.string().min(8).required()
    })
    .xor("username", "email");

    return schema.validate(data);
}

module.exports.signUpValidation = signUpValidation;
module.exports.loginValidation = loginValidation;