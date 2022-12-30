const { body } = require('express-validator');

module.exports = {

    addNegotiationValidator : [
        body('sender_id').isNumeric(),
        body('receiver_id').isNumeric(),
        body('crop_id').isNumeric(),
        body('type').isString(),
        // body('admin_id').optional().isEmpty().isNumeric()
        body('message').isString(),
        // body('messagetype').isString(),
        // body('status').isString(),
    ],

    negotiation : [
        body('id').isNumeric()
    ]

}