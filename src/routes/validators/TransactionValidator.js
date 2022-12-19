const { body } = require('express-validator');

module.exports = {

    PricingValidator : [
        body('userId').isString(),
        body('clientId').isString(),
        body('type').isString()
    ],
    
    addTransactionValidator : [
        body('type').isString(),
        body('type_id').isString(),
        body('amount_paid').isNumeric(),
        body('status').isString()
    ],

}