const { body } = require('express-validator');

const Extended = {
    addCropValidator: [
        
        body('category_id').not().isEmpty(),
        body('subcategory_id').not().isEmpty(),
        body('description').not().isEmpty(),
        // body('images').not().isEmpty(),
        body('currency').not().isEmpty(),
        body('is_negotiable').not().isEmpty(),
        body('video').optional(),
        

        body('qty').not().isEmpty(),
        body('price').not().isEmpty(),
        body('color').not().isEmpty(),
        body('moisture_content').not().isEmpty(),
        body('foreign_matter').not().isEmpty(),
        body('broken_grains').optional(),
        body('weevil').optional(),
        body('dk').optional(),
        body('rotten_shriveled').optional(),
        body('test_weight').not().isEmpty(),
        body('hectoliter').optional(),
        body('hardness').optional(),
        body('splits').optional(),
        body('oil_content').optional(),
        body('infestation').optional(),
        body('grain_size').optional(),
        body('total_defects').optional(),
        body('dockage').optional(),
        body('ash_content').optional(),
        body('acid_ash').optional(),
        body('volatile').optional(),
        body('mold').optional(),
        body('drying_process').optional(),
        body('dead_insect').optional(),
        body('mammalian').optional(),
        body('infested_by_weight').optional(),
        body('curcumin_content').optional(),
        body('extraneous').optional(),
    ],
}
module.exports = {

    addCropWantedValidator: [

        ...Extended.addCropValidator,
        body('state').isString(),
        body('zip').isString(),
        body('country').isString(),
        body('delivery_window').not().isEmpty(),
        body('warehouse_address').isString(),

    ],

    addCropForSaleValidator: [

        ...Extended.addCropValidator,
        body('state').isString(),
        body('zip').isString(),
        body('country').isString(),
        body('warehouse_address').isString(),

    ],


    addCropRequestValidator: [
        body('crop_id').isNumeric(),
        body('state').isString(),
        body('zip').isString(),
        body('country').isString(),
        body('address').isString(),        
        body('delivery_window').isString()
    ],


    addCropSpecificationValidator: [
        
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
       
    ],

    createAuctionBid: [
        body('amount').not().isEmpty()
    ]

}