const { body } = require('express-validator');

module.exports = {

    addSubCategoryValidator : [
        body('subcategory_name').isString(),
        body('category_id').optional().isString()
    ],

    createSubCategoryValidator: [
        body('subcategory_name').isString().not().isEmpty(),
        body('category_id').isString().not().isEmpty()
    ],

    deleteSubCategoryValidator: [
        body('id').isString().not().isEmpty()
    ],
    
    updateSubCategoryValidator: [
        body('id').isString().not().isEmpty(),
        body('subcategory_name').isString().not().isEmpty()
    ],

    getSubCategoryValidator: [
        body('category_id').isString().not().isEmpty()
    ],

}