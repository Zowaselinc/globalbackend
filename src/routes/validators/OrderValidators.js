const { body } = require('express-validator');

module.exports = {
     
    OrderValidators : [
        body('orderId').isString(),
        body('amount').isString(),
        body('total_product').isString(),
        body('action').isString(),
    ],

}