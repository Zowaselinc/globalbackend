const { body } = require('express-validator');

const Extended = {
    addCropValidator : [
        // Crop model requirements
        body('type').isString(),
        body('user_id').isString(),
        body('title').isString(),
        body('category_id').isString(),
        body('subcategory_id').isString(),
        body('description').isString(),
        // body('images').isString(),
        body('currency').isString(),
        body('is_negotiable').isString(),
        body('video').isString(),
        body('packaging').isString(),
        body('application').isString(),

        // Crop specification Requirements

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
    ],
}
module.exports = {

    addCropWantedValidator : [

        ...Extended.addCropValidator,
        // body('crop_id').isNumeric(),
        body('state').isString(),
        body('zip').isString(),
        body('country').isString(),
        body('address').isString(),
        body('delivery_method').isString(),
        body('delivery_date').isString(),
        body('delivery_window').isString()

    ],


    addCropRequestValidator : [
        body('crop_id').isNumeric(),
        body('state').isString(),
        body('zip').isString(),
        body('country').isString(),
        body('address').isString(),
        body('delivery_method').isString(),
        body('delivery_date').isString(),
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