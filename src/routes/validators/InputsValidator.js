const { body } = require('express-validator');

module.exports = {

    createInputValidator: [
        // body('user_id').isString().not().isEmpty(),
        body('category_id').not().isEmpty(),
        body('subcategory_id').not().isEmpty(),
        body('product_type').not().isEmpty(),
        body('crop_focus').not().isEmpty(),
        body('stock').not().isEmpty(),
        body('packaging').not().isEmpty(),
        body('description').not().isEmpty(),
        body('usage_instruction').not().isEmpty(),
        body('kilograms').not().isEmpty(),
        body('grams').optional(),
        body('liters').not().isEmpty(),
        body('price').not().isEmpty(),
        body('currency').not().isEmpty(),
        body('manufacture_name').not().isEmpty(),
        body('manufacture_date').not().isEmpty(),
        body('delivery_method').not().isEmpty(),
        body('expiry_date').not().isEmpty(),
        body('manufacture_country').not().isEmpty(),
        body('video').optional()
    ],

    addToCartValidator: [
        body('user_id').not().isEmpty(),
        body('input_id').not().isEmpty(),
        body('quantity').isNumeric().not().isEmpty(),
    ]

}