const { body } = require('express-validator');

module.exports = {
     
    OrderValidators : [
        body('orderId').isString(),
        body('amount').isString(),
        body('total_product').isString(),
        body('action').isString(),
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
