const { body } = require('express-validator');

module.exports = {

    addProductValidator : [
        // body('type').isString(),
        body('user_id').isString(),
        body('type').isString(),
        body('category').isString(),
        body('sub_category').isString(),
        // body('active').isString(),
        // body('market').isString(),
        body('description').isString(),
        // body('images').isString(),
        body('currency').isString(),
        body('is_negotiable').isString(),
        body('video').isString(),
        body('packaging').isString(),
        body('application').isString(),
        body('manufacture_name').isString(),
        body('manufacture_date').isString(),
        body('expiration_date').isString(),

        body('model_type').isString(),
        body('qty').isNumeric(),
        body('price').isNumeric(),
        body('color').isString(),
        body('moisture').isNumeric(),
        body('foreign_matter').isNumeric(),
        body('broken_grains').isNumeric(),
        body('weevil').isNumeric(),
        body('dk').isNumeric(),
        body('rotten_shriveled').isNumeric(),
        body('test_weight').isString(),
        body('hectoliter').isNumeric(),
        body('hardness').isString(),
        body('splits').isNumeric(),
        body('oil_content').isNumeric(),
        body('infestation').isNumeric(),
        body('grain_size').isString(),
        body('total_defects').isNumeric(),
        body('dockage').isNumeric(),
        body('ash_content').isNumeric(),
        body('acid_ash').isNumeric(),
        body('volatile').isNumeric(),
        body('mold').isNumeric(),
        body('drying_process').isString(),
        body('dead_insect').isNumeric(),
        body('mammalian').isNumeric(),
        body('infested_by_weight').isNumeric(),
        body('curcumin_content').isNumeric(),
        body('extraneous').isNumeric(),
        body('kg').isNumeric(),
        body('liters').isNumeric(),

        // body('product_id').isNumeric(),
        body('state').isString(),
        body('zip').isString(),
        body('country').isString(),
        body('address').isString(),
        body('delivery_method').isString(),
        body('delivery_date').isString(),
        body('delivery_window').isString()
    ],

}