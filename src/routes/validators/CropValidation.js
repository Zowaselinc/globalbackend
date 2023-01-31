const { body } = require('express-validator');

const Extended = {
    addCropValidator : [
        // Crop model requirements
        // body('type').isString(),
        // body('user_id').isString(),
        body('title').not().isEmpty(),
        body('category_id').not().isEmpty(),
        body('subcategory_id').not().isEmpty(),
        body('description').not().isEmpty(),
        // body('images').not().isEmpty(),
        body('currency').not().isEmpty(),
        body('is_negotiable').not().isEmpty(),
        body('video').not().isEmpty(),
        // body('packaging').not().isEmpty(),

        // Crop specification Requirements

        body('qty').not().isEmpty(),
        body('price').not().isEmpty(),
        body('color').not().isEmpty(),
        body('moisture_content').not().isEmpty(),
        body('foreign_matter').not().isEmpty(),
        body('broken_grains').not().isEmpty(),
        body('weevil').not().isEmpty(),
        body('dk').not().isEmpty(),
        body('rotten_shriveled').not().isEmpty(),
        body('test_weight').not().isEmpty(),
        body('hectoliter').not().isEmpty(),
        body('hardness').not().isEmpty(),
        body('splits').not().isEmpty(),
        body('oil_content').not().isEmpty(),
        body('infestation').not().isEmpty(),
        body('grain_size').not().isEmpty(),
        body('total_defects').not().isEmpty(),
        body('dockage').not().isEmpty(),
        body('ash_content').not().isEmpty(),
        body('acid_ash').not().isEmpty(),
        body('volatile').not().isEmpty(),
        body('mold').not().isEmpty(),
        body('drying_process').not().isEmpty(),
        body('dead_insect').not().isEmpty(),
        body('mammalian').not().isEmpty(),
        body('infested_by_weight').not().isEmpty(),
        body('curcumin_content').not().isEmpty(),
        body('extraneous').not().isEmpty(),
        // body('unit').isString(),
    ],
}
module.exports = {

    addCropWantedValidator : [

        ...Extended.addCropValidator,
        body('state').isString(),
        body('zip').isString(),
        body('country').isString(),
        body('address').isString(),
        body('delivery_window').not().isEmpty(),

    ],


    addCropRequestValidator : [
        body('crop_id').isNumeric(),
        body('state').isString(),
        body('zip').isString(),
        body('country').isString(),
        body('address').isString(),
        // body('delivery_method').isString(),
        // body('delivery_date').isString(),
        body('delivery_window').isString()
    ],


    addCropSpecificationValidator : [
        // body('model_id').isNumeric(),
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
        body('unit').isString(),
        // body('kg').isNumeric(),
        // body('liters').isNumeric(),
    ],

}