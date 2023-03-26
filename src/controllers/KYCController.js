const { validationResult } = require("express-validator");
const { Crop, ErrorLog, Order, User, Company, KYC } = require("~database/models");
const bcrypt = require('bcryptjs');
const OnfidoInstance = require("~providers/Onfido");
var base64 = require('base64-stream');

const { EncryptConfig, DecryptConfig } = require("~utilities/encryption/encrypt");
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
            const body = req.body;

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
                            verified: 0,
                            bvn: EncryptConfig(body.bvn)
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

                //UPDATES USER RECORD
                const user = await User.update({
                    first_name: body.first_name,
                    last_name: body.last_name,
                    phone_number: body.phone,
                    dob: body.email,
                    country: body.country,
                    state: body.state,
                    gender: body.gender,
                    city: body.city,
                    address: body.address
                }, { where: { id: userData.id } });



                /* ---------------------------- CHECKS DOCUMENTS ---------------------------- */
                let allImages = Object.keys(req.files);
                for (let index = 0; index < allImages.length; index++) {
                    const imageKey = allImages[index];
                    var uploaded = await OnfidoInstance.uploadDocument(req.files[imageKey], imageKey);

                }
                var response = await OnfidoInstance.checkDocument();
                if (response) {
                    try {

                        const user = await KYC.update({
                            status: "pending",
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

    static async getDocumentTypes(req, res) {
        return res.status(200).json({
            error: false,
            types: ["identity_card", "driving_licence", "voter_id", "passport"]
        });
    }

    static async retriveCheck(req, res) {

        var userData = req.global.user;
        var kycDataObj;

        if (req.global.kyc) {
            let data = req.global.kyc;
            kycDataObj = data;

        }
        if (!kycDataObj) {

            return res.status(200).json({
                error: false,
                message: "This User Has No Applicant ID  Or Check ID",
                data: { status: "Unverified" }
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

                var documentList = await OnfidoInstance.listDocument(kycDataObj.applicant_id);
                for (let index = 0; index < documentList.length; index++) {
                    const document = documentList[index];
                    const downloadDocument = await OnfidoInstance.downloadDocument(document.id);
                    var base64 = await KYCController.streamToBase64(downloadDocument.asStream());
                    documentList[index]['base64'] = `data:${downloadDocument.contentType};base64,${base64}`;
                }
                return res.status(200).json({
                    error: false,
                    message: "Successful",
                    data: {
                        status: doc.status == "complete" ? "Verified" : "Pending Verification",
                        documents: documentList
                    }
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
    static streamToBase64 = (stream) => {
        const concat = require('concat-stream')
        const { Base64Encode } = require('base64-stream')

        return new Promise((resolve, reject) => {
            const base64 = new Base64Encode()

            const cbConcat = (base64) => {
                resolve(base64)
            }

            stream
                .pipe(base64)
                .pipe(concat(cbConcat))
                .on('error', (error) => {
                    reject(error)
                })
        })
    }

    static async getDocument(req, res) {
        var data;
        var doc = await OnfidoInstance.downloadDocument(req.params.id);
        res.setHeader('Content-Type', doc.contentType);
        var stream = doc.asStream();
        stream.pipe(res);
    }

}
module.exports = KYCController;
