const { body } = require('express-validator');

module.exports = {

    addSubCategoryValidator : [
        body('subcategory_name').isString(),
        body('category_id').optional().isString()
    ],

}