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
        body('buyer_id').isString().not().isEmpty(),
        body('buyer_type').isString().not().isEmpty(),
        body("payment_option").isString().not().isEmpty(),
        body('input_id').isString().not().isEmpty(),
        body('payment_status').isString().not().isEmpty(),
        body('waybill_details').isString().not().isEmpty()
    ],

    updateOrderValidator: [
        body('order_id').isString().not().isEmpty(),
        body('payment_status').isString().not().isEmpty()
    ]

}

