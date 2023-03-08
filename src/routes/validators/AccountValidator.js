const { body } = require('express-validator');

module.exports = {

    updateAccountValidator: [
        body('first_name').isString().notEmpty(),
        body('last_name').isString().notEmpty(),
        body('phone').isString().notEmpty(),
        body('state').isString().notEmpty(),
        body('city').isString().notEmpty(),
        body('address').isString().notEmpty(),
    ],

    updateCompanyValidator: [
        body('company_name').isString().notEmpty(),
        body('company_address').isString().notEmpty(),
        body('state').isString().notEmpty(),
        body('email').isString().notEmpty(),
        body('phone').isString().notEmpty(),

    ],

    changePasswordValidator: [
        body('current_password').isString(),
        body('new_password').isString(),
        body('confirm_password').isString()
    ]

}