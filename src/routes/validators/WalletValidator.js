const { body } = require('express-validator');

module.exports = {

    withdrawalRequestValidator: [
        body('amount').isString().notEmpty(),
        body('code').notEmpty(),
    ],


}