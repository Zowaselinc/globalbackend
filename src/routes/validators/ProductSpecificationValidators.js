const { body } = require('express-validator');

module.exports = {
     
    ProductSpecificationValidators : [
        body('category').isString(),
        body('sub_category').isString(),
        body('color').isString(),
        body('moisture').isString(),
        body('matter').isString(),
        body('broken_grains').isString(),
        body('weeevil').isString(),
        body('dk').isString(),
        body('rotten_shriveled').isString(),
        body('weight').isString(),
        body('hectolitter').isString(),
        body('hardness').isString(),
        body('splits').isString(),
        body('oil_content').isString(),
        body('infestation').isString(),
        body('grian_size').isString(),
        body('total_defects').isString(),
        body('dockage').isString(),
        body('ash_content').isString(),
        body('acid_ash').isString(),
        body('volatile').isString(),
        body('mold').isString(),
        body('drying_process').isString(),
        body('dead_insect').isString(),
        body('mammalian').isString(),
        body('infested_by_weight').isString(),
        body('curcumin_content').isString(),
        body('extraneous').isString(),
        body('kg').isString(),
        body('liters').isString(),
    ],

}