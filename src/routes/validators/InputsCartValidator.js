const { body } = require('express-validator');

module.exports = {

    addToCartValidator: [
        body('user_id').isString().not().isEmpty(),
        body('crop_id').isString().not().isEmpty(),
        body('quantity').isString().not().isEmpty(),
        body('price').isString().not().isEmpty()
    ]

}