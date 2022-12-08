const { body } = require('express-validator');

module.exports = {

    addCategoryValidator : [
        body('name').isString()
    ],

    createCategoryValidator: [
        body('category_name').isString().not().isEmpty()
    ],

    deleteCategoryValidator: [
        body('id').isString().not().isEmpty()
    ],
    
    updateCategoryValidator: [
        body('id').isString().not().isEmpty(),
        body('category_name').isString().not().isEmpty()
    ]

}