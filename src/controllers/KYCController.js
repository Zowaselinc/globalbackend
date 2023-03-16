const { validationResult } = require("express-validator");
const { Crop, ErrorLog, Order, User, Company, KYC } = require("~database/models");
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

                if (!fileKeys.includes('front')) {
                    return res.status(400).json({
                        error: true,
                        message: "ID Front is required",
                    });
                }

                if (!fileKeys.includes('back')) {
                    return res.status(400).json({
                        error: true,
                        message: "ID Back is required",
                    });
                }

                // if (!fileKeys.includes('passport')) {
                //     return res.status(400).json({
                //         error: true,
                //         message: "passport is required",
                //     });
                // }
                var userData = req.global.user;

                let applicant = await OnfidoInstance.createNewApplicant({
                    ...{
                        first_name: userData.first_name,
                        last_name: userData.last_name,
                        email: userData.email,
                        dob: userData.dob,
                        country: userData.country
                    },
                    ...req.body
                });


                if (applicant) {
                    //SAVES USER APPLICANT_ID
                    let userKyc;
                    try {
                        userKyc = await KYC.create({
                            user_id: userData.id,
                            applicant_id: applicant.id,
                            is_verified: 0
                        });
                    } catch (error) {
                        console.log(error)
                    }


                } else {
                    return res.status(400).json({
                        error: true,
                        message: "An Error Occurred",
                    });
                }

                let allImages = Object.keys(req.files);
                for (let index = 0; index < allImages.length; index++) {
                    const imageKey = allImages[index];
                    var uploaded = await OnfidoInstance.uploadDocument(req.files[imageKey], imageKey);

                }
                var response = await OnfidoInstance.checkDocument();
                if (response) {
                    try {
                        const user = await KYC.update({
                            status: response.status,
                            check_id: response.id,
                        }, { where: { user_id: userData.id } });

                    } catch (error) {
                        console.log(error);
                    }
                    return res.status(200).json({
                        error: false,
                        message: "Successful",
                        data: { response: response },
                    });
                } else {
                    return res.status(400).json({
                        error: true,
                        message: "An Error Occured Try Again",
                    });
                }

            }

        } catch (e) {
            var logError = await ErrorLog.create({
                error_name: "Error on Start KYC",
                error_description: e.toString(),
                route: req.route.path,
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

    static async retriveCheck(req, res) {
        const errors = validationResult(req);
        var userData = req.global.user;
        var kycDataObj;

        if (req.global.getKycdata[0]) {
            let data = req.global.getKycdata[0]["dataValues"];
            kycDataObj = data;

        }
        if (!kycDataObj) {
            return res.status(400).json({
                error: true,
                message: "This User Has No Applicant ID  Or Check ID"
            });
        }


        try {
            var doc = await OnfidoInstance.retriveDocument(kycDataObj.check_id);
            try {

                const user = await KYC.update({
                    status: doc.status,
                    is_verified: doc.status == "complete" ? 1 : 0
                }, { where: { user_id: userData.id } });


            } catch (error) {
                console.log(error);
            }
            if (doc) {
                return res.status(200).json({
                    error: false,
                    message: "Successful",
                    data: { response: doc, },
                });
            } else {
                return res.status(400).json({
                    error: true,
                    message: "An Error Occured Try again",
                });
            }
        }
        catch (error) {

        }
    }

    static async listCheck(req, res) {
        const errors = validationResult(req);
        try {
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: true,
                    message: "applicant_id fields are required",
                    data: errors,
                });
            } else {
                console.log(req.body.applicant_id)
                var doc = await OnfidoInstance.listCheck(req.body.applicant_id)
                if (doc) {
                    return res.status(200).json({
                        error: false,
                        message: "Successful",
                        data: { response: doc },
                    });
                } else {
                    return res.status(400).json({
                        error: true,
                        message: "An Error Occured Try again",
                    });
                }
            }
        } catch (error) {

        }
    }

    static async downloadCheck(req, res) {
        const errors = validationResult(req);
        try {
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: true,
                    message: "id fields are required",
                    data: errors,
                });
            } else {

                var doc = await OnfidoInstance.downloadCheck(req.body.id);
                //console.log(doc)
                // console.log(Object.keys(OnfidoDownload));
                // console.log(Object.keys(doc));
                // console.log(doc.responseUrl);
                // console.log("doc.asStream");
                //console.log(doc.)
                if (doc) {
                    return res.status(200).json({
                        error: false,
                        message: "Successful",
                        data: { response: doc.asStream },
                    });
                } else {
                    return res.status(400).json({
                        error: true,
                        message: "An Error Occured Try again",
                    });
                }
            }
        } catch (error) {

        }
    }

}
module.exports = KYCController;
