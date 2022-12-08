const { body } = require('express-validator');

module.exports = {

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

}