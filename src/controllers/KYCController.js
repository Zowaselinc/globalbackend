const { validationResult } = require("express-validator");
const { Crop, ErrorLog, Order, User, Company } = require("~database/models");
const bcrypt = require('bcryptjs');
const OnfidoInstance = require("~providers/Onfido");

class KYCController {
    /* ------------------------------  ----------------------------- */
    static async startKycVerification(req, res) {

        const errors = validationResult(req);

        try {
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: true,
                    message: "All fields are required",
                    data: errors,
                });
            }
            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).json({
                    error: true,
                    message: "No files were uploaded.",
                });
            } else {

                var fileKeys = Object.keys(req.files);

                if (!fileKeys.includes('id_front')) {
                    return res.status(400).json({
                        error: true,
                        message: "ID Front is required",
                    });
                }

                if (!fileKeys.includes('id_back')) {
                    return res.status(400).json({
                        error: true,
                        message: "ID Back is required",
                    });
                }

                // first_name: req.global.user.first_name,
                // last_name: req.global.user.last_name,
                // email: req.global.user.email,
                // dob: "09/09/1901",
                // country : req.global.country

                let applicant = await OnfidoInstance.createNewApplicant({
                    ...{
                        first_name: "John",
                        last_name: "Doe",
                        email: "johndeo@myself.com",
                        dob: "09/09/1901",
                        country: "Nigeria"
                    },
                    ...req.body
                });

                console.log(applicant);

                let allImages = Object.keys(req.files);

            }

        } catch (e) {
            var logError = await ErrorLog.create({
                error_name: "Error on add a crop",
                error_description: e.toString(),
                route: "/api/crop/add",
                error_code: "500",
            });
            if (logError) {
                return res.status(500).json({
                    error: true,
                    message: "Unable to complete request at the moment",
                });
            }
        }
    }
}
module.exports = KYCController;
