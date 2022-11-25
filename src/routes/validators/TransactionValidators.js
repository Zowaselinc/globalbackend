const { body } = require('express-validator');

module.exports = {

    PricingValidator : [
        body('userId').isString(),
        body('clientId').isString(),
        body('type').isString()
    ],
    
    TransactionValidator : [
        body('transaction_ref').isString(),
        body('amount').isString(),
        body('method').isString(),
        body('type').isString(),
        body('status').isString(),
    ],

}