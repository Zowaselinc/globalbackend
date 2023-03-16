const { body } = require('express-validator');

module.exports = {

    updateAccountValidator: [
        body('first_name').isString().notEmpty(),
        body('last_name').isString().notEmpty(),
        body('phone').isString().notEmpty(),
        body('state').isString().notEmpty(),
        body('city').isString().notEmpty(),
        body('address').isString().notEmpty(),
    ],

    updateCompanyValidator: [
        body('company_name').isString().notEmpty(),
        body('company_address').isString().notEmpty(),
        body('state').isString().notEmpty(),
        body('email').isString().notEmpty(),
        body('phone').isString().notEmpty(),

    ],

    changePasswordValidator: [
        body('current_password').isString(),
        body('new_password').isString(),
        body('confirm_password').isString()
    ],


    startKYC: [
        body('id_type').isString().matches('^(passport|voter_id|ssn|social_insurance|tax_id|identity_card|driving_licence|share_code|voter_id|passport)'),
        body('id_number').not().isEmpty(),
    ],

    retriveCheck: [
        body('id').not().isEmpty(),
    ],

    listCheck: [
        body('applicant_id').not().isEmpty(),
    ],

    downloadCheck: [
        body('id').not().isEmpty(),
    ],



}