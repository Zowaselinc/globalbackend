const { body } = require('express-validator');

module.exports = {

    createAddressValidator: [
        body('user_id').isString().not().isEmpty(),
        body('address').isString().not().isEmpty(),
        body('zip').isString().not().isEmpty(),
        body('state').isString().not().isEmpty(),
        body('country').isString().not().isEmpty()
    ],

    addToCartValidator: [
        body('user_id').isString().not().isEmpty(),
        body('input_id').isString().not().isEmpty(),
        body('quantity').isString().not().isEmpty(),
        body('price').isString().not().isEmpty()
    ]

}