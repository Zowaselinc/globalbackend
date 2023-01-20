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

    verifyTransaction : [
        body('transaction_id').isString(),
        body('transaction_ref').isString(),
        body('order').isString().optional(),
        body('subscription').isString().optional(),
        body('partial').optional(),
    ]
}