const { body } = require('express-validator');

module.exports = {

    addCategoryValidator : [
        body('name').isString()
    ],

}