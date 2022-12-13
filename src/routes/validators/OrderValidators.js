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

    updateTrackingDetailsValidators : [
        body('order_id').isString().not().isEmpty(),
        body('tracking_details.pickupstation.tracking_description').isString().not().isEmpty(),
        body('tracking_details.pickupstation.location').isString().not().isEmpty(),
        body('tracking_details.pickupstation.pickup_date').isString().not().isEmpty(),
        body('tracking_details.shipping.tracking_description').isString().not().isEmpty(),
        body('tracking_details.shipping.location').isString(),
        body('tracking_details.shipping.shipping_date').isString(),
        body('tracking_details.delivered.tracking_description').isString().not().isEmpty(),
        body('tracking_details.delivered.location').isString(),
        body('tracking_details.delivered.delivered_date').isString()
    ],

    updateWaybillDetailsValidators : [
        body('order_id').isString().not().isEmpty(),
        body('waybill_details.dispatch_section.from_seller_id').isNumeric().not().isEmpty(),
        body('waybill_details.dispatch_section.seller_title').isString().not().isEmpty(),
        body('waybill_details.dispatch_section.to_buyer_id').isNumeric().not().isEmpty(),
        body('waybill_details.dispatch_section.buyer_title').isString().not().isEmpty(),
        body('waybill_details.dispatch_section.consignee').isString().not().isEmpty(),
        body('waybill_details.dispatch_section.truck_no').isString().not().isEmpty(),

        body('waybill_details.details.no1').isNumeric().not().isEmpty(),
        body('waybill_details.details.description1').isString().not().isEmpty(),
        body('waybill_details.details.quantity1').isString()
    ],

    updateGoodReceiptValidators : [
        body('order_id').isString().not().isEmpty(),
        body('good_receipt_note.crop_description').isString().not().isEmpty(),
        body('good_receipt_note.packaging').isString().not().isEmpty(),
        body('good_receipt_note.no_of_bags').isNumeric().not().isEmpty(),
        body('good_receipt_note.scale_type').isString().not().isEmpty(),
        body('good_receipt_note.gross_weight').isNumeric().not().isEmpty(),
        body('good_receipt_note.tare_weight').isNumeric().not().isEmpty(),
        body('good_receipt_note.net_weight').isNumeric().not().isEmpty(),
        body('good_receipt_note.rejected_quantity').isString().not().isEmpty(),
        body('good_receipt_note.accepted_quantity').isString().not().isEmpty(),
        body('good_receipt_note.rate').isString().not().isEmpty(),
        body('good_receipt_note.discount').isString().not().isEmpty(),
        body('good_receipt_note.total_value').isString().not().isEmpty(),
    ],

    InputOrderValidator: [
        body('user_id').isString().not().isEmpty(),
        body('delivery_address_id').isString().not().isEmpty(),
        body("total_price").isNumeric().not().isEmpty(),
        body('delivery_method').isString().not().isEmpty(),
        body('payment_method').isString().not().isEmpty(),
        body('orders').isString().not().isEmpty()
    ],

    updateOrderValidator: [
        body('order_id').isString().not().isEmpty(),
        body('payment_status').isString().not().isEmpty()
    ]

}
