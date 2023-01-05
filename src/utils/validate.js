const  joi = require('joi');

class Validate {
   postUserValidation = joi.object().keys({
        name: joi.string().min(3).messages({'string.base': `Ism text tipida kelsin`,'string.empty': `Ism bo'sh kelmasin`,'string.min': `Ism eng kamida {#limit} ta harfdan iborat bo'lsin`,'any.required': `Ism kiritilishi shart`}),
        parol: joi.string().min(3),
        pic: joi.string().min(5)
    })

    loginValidation = joi.object().keys({
        name: joi.string().min(3).required(),
        parol: joi.string().min(3).required()
    })
}

module.exports = new Validate;