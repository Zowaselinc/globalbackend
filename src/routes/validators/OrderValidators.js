const { body } = require('express-validator');

module.exports = {
     
    cropAddOrderValidators : [
        body('buyer_id').isString(),
        body('buyer_type').isString(),
        body('payment_option').isString(),
        body('payment_status').isString()
    ],

    InputOrderValidator: [
        body('user_id').isString().not().isEmpty(),
        body('delivery_address_id').isString().not().isEmpty(),
        body("total_price").isNumeric().not().isEmpty(),
        body('delivery_method').isString().not().isEmpty(),
        body('payment_method').isString().not().isEmpty(),
        body('orders').isString().not().isEmpty()
    ],

    UpdateTransactionIdValidator: [
        body('user_id').isNumeric().not().isEmpty(),
        body('transaction_id').isString().not().isEmpty()
    ]

}
