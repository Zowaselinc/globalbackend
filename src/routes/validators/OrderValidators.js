const { body } = require('express-validator');

module.exports = {
     
    cropAddOrderValidators : [
        body('accept_offer_type').isString().not().isEmpty(),
        body('buyer_id').isNumeric().not().isEmpty(),
        body('buyer_type').isString().not().isEmpty(),
        body('crop_id').isNumeric().not().isEmpty(),
        body('negotiation_id').isString(),
        body('payment_option').isString().not().isEmpty(),
        body('payment_status').isString().not().isEmpty()
    ],

    cropGetOrderByIdValidators: [
        body('orderid').isString().not().isEmpty()
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
