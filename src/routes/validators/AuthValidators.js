const { body } = require('express-validator');

module.exports = {

    RegisterMerchantValidator : [
        body('first_name').isString(),
        body('last_name').isString(),
        body('email').isString().isEmail(),
        body('phone').isLength({max : 11}).isNumeric(),
        body('password').isStrongPassword(),
        body('has_company').optional().isBoolean(),
        body('company_name').if(body('has_company').exists()).isString(),
        body('company_address').if(body('has_company').exists()).isString(),
        body('company_state').if(body('has_company').exists()).isString(),
        body('rc_number').if(body('has_company').exists()).isString(),
        body('company_email').if(body('has_company').exists()).isString().isEmail(),
        body('company_phone').if(body('has_company').exists()).isLength({max : 11}).isNumeric(),
    ],

    RegisterPartnerValidator : [
        body('first_name').isString(),
        body('last_name').isString(),
        body('email').isString().isEmail(),
        body('phone').isLength({max : 11}).isNumeric(),
        body('password').isStrongPassword(),
        body('partnership_type').isString(),
        body('company_name').isString(),
        body('company_address').isString(),
        body('company_state').isString(),
        body('rc_number').isString(),
        body('company_email').isString().isEmail(),
        body('company_phone').isLength({max : 11}).isNumeric(),
    ],

    LoginValidator : [
        body('email').isString().isEmail(),
        body('password').isString()
    ]

}