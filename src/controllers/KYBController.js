var appRoot = require("app-root-path");
const md5 = require("md5");
const { validationResult } = require("express-validator");
const { use } = require("~routes/api");
const { KYB, Company } = require("~database/models");
const fs = require('fs');
const crypto = require('crypto');
var FormData = require('form-data');

const axios = require('axios');


class KYBController {
    static async startKybVerification(req, res) {

        const errors = validationResult(req);
        const body = req.body


        try {
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: true,
                    message: "All fields are required",
                    data: errors,
                });
            }
            var fileKeys = Object.keys(req.files);

            if (!fileKeys.includes('cac')) {
                return res.status(400).json({
                    error: true,
                    message: "CAC Document is required",
                });
            }

            if (!fileKeys.includes('financial_statement')) {
                return res.status(400).json({
                    error: true,
                    message: "Financial Statement Document is required",
                });
            }

            if (!fileKeys.includes('mou')) {
                return res.status(400).json({
                    error: true,
                    message: "MOU Document is required",
                });
            }
            var userData = req.global.user;
            var data = req.body;
            var pathlist = []
            if (req.files && Object.keys(req.files).length > 0) {
                let allImage = Object.keys(req.files);

                for (let index = 0; index < allImage.length; index++) {
                    const key = allImage[index];
                    let file = req.files[key];
                    let extension = file.mimetype.split("/")[1];
                    let newName =
                        md5(file.name + new Date().toDateString()) + `.${extension}`;
                    let path = `${appRoot}/public/data/kyb/${userData.id}`;
                    if (!fs.existsSync(path)) {
                        fs.mkdirSync(path);
                    }
                    let sampleFile = file;
                    let profileImagePath = `${path}/${newName}`;
                    let uploadPath = `${profileImagePath}`;


                    sampleFile.mv(uploadPath, async function (err) {
                        const images = fs.createReadStream(uploadPath);
                        const form = new FormData();
                        form.append("image", images)

                        const response = await axios.post('https://filesapi.growsel.com/upload.php', form
                        );
                        fs.unlink(uploadPath, function(err) {
                            if (err) {
                              throw err
                            } else {
                            //   console.log("Successfully deleted the file.")
                            }
                          })
                        pathlist.push(response.data.data.imageLink);

                        if (index == allImage.length - 1) {
                            KYBController.savekyb(pathlist, userData, data, res)
                           
                        }

                        if (err) {
                            return res.status(500).send(err + " Error in uploading file");
                        }
                    });
                }

            } else {

            }
           
        } catch (error) {
            console.log(error);
        }
    }

    static async savekyb(pathlist,userData,data, res) {
      
            console.log(pathlist)
            try {
                let id = crypto.randomUUID();
                //CREATE KYB RECORD
                let userKyb = await KYB.create({
                    user_id: userData.id,
                    tax_id: data.tax_id,
                    cac: pathlist[0],
                    financial_statement: pathlist[1],
                    mou: pathlist[2],
                    check_id: id,
                    status: "pending",
                });
                //UPDATES COMPANY RECORD 
                let company = await Company.update({
                    company_name: data.name,
                    company_address: data.address,
                    state: data.state,
                    country: data.country,
                    contact_person: data.contact_person,
                    company_phone: data.phone,
                    company_website: data.website,
                    company_email: data.email,
                }, { where: { user_id: userData.id } });

                if (userKyb && company) {
                    return res.status(200).json({
                        error: false,
                        message: "Data Uploaded Successfully",
                    });
                } else {
                    return res.status(400).json({
                        error: true,
                        message: "Could Not Upload Data",
                    });
                }
            } catch (error) {

            }
        
    }

    static async retriveCheck(req, res) {
        var kybDataObj;
        if (req.global.kyb) {
            let data = req.global.kyb;
            kybDataObj = data;
        }
        if (!kybDataObj) {
            return res.status(200).json({
                error: false,
                message: "This User Has No KYB Check ID",
                data: { status: "Unverified" }
            });
        } else {


            return res.status(200).json({
                error: false,
                message: "Successful",
                data: {
                    status: kybDataObj.status == "complete" ? "Verified" : "Pending Verification",
                    check_id: kybDataObj.check_id,

                }
            });
        }
    }

    static async getDocument(req, res) {
        var kybDataObj;
        if (req.global.kyb) {
            let data = req.global.kyb;
            kybDataObj = data;
        }
        if (!kybDataObj) {
            return res.status(200).json({
                error: false,
                message: "This User Has No KYB Document",
                data: { status: "Unverified" }
            });
        } else {

            var split = `${appRoot}/public`;
            var company_details = await Company.findOne({ where: { user_id: kybDataObj.user_id } });
            if (company_details) {
                return res.status(200).json({
                    error: false,
                    message: "Successful",
                    data: {
                        cac: kybDataObj.cac.split(split)[1],
                        financial_statement: kybDataObj.financial_statement.split(split)[1],
                        mou: kybDataObj.mou.split(split)[1],
                        contact_person: company_details.contact_person,
                        website: company_details.company_website,
                        tax_id: kybDataObj.tax_id,
                    }
                });
            } else {
                return res.status(200).json({
                    error: false,
                    message: "An Error Occcured",

                });
            }
        }
    }
}

module.exports = KYBController;