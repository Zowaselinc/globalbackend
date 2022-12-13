const { request } = require("express");
const { Inputs, ErrorLog } = require("~database/models");
const { validationResult } = require("express-validator");
const crypto = require("crypto");
// const jwt = require("jsonwebtoken");

class InputProducts{

    static async createInput(req , res){

        let sampleFile;
        let uploadPath;

        const errors = validationResult(req);

        let randomid = crypto.randomBytes(8).toString('hex');
        
        try{

            if(!errors.isEmpty()){
                return res.status(400).json({
                    "error": true,
                    "message": "All fields are required",
                    "data": []
                }) 
            }

            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).json({
                    "error": true,
                    "message": "No input images(s) found.",
                    "data": []
                })
            
            }else{
                
                
                let allImages = Object.keys(req.files);

                /* -------------------------- MOVE UPLOADED FOLDER -------------------------- */
                let my_object = [];
                for(let i = 0; i < allImages.length; i++ ){
                    
                    my_object.push(req.files[allImages[i]].name);
                    sampleFile = req.files[allImages[i]];
                    uploadPath = __dirname + "/uploads/" + req.files[allImages[i]].name;

                    sampleFile.mv(uploadPath, function(err) {
                    });
                }
                /* -------------------------- MOVE UPLOADED FOLDER -------------------------- */


                /* ------------------------ INSERT INTO PRODUCT TABLE ----------------------- */
               
                var input = await Inputs.create({
                    user_id: req.body.user_id,
                    category: req.body.category,
                    sub_category: req.body.sub_category,
                    crop_focus: req.body.crop_focus,
                    packaging: req.body.packaging,
                    description: req.body.description,
                    usage_instruction: req.body.usage_instruction,
                    unit: req.body.unit,
                    liters: req.body.liters,
                    images: my_object.toString(),
                    price: req.body.price,
                    currency: req.body.currency,
                    manufacture_name: req.body.manufacture_name,
                    manufacture_date: req.body.manufacture_date,
                    delivery_method: req.body.delivery_method,
                    expiry_date: req.body.expiry_date,
                    manufacture_country: req.body.manufacture_country,
                    state: req.body.state,
                    video: req.body.video
                })
                
                /* ------------------------ INSERT INTO PRODUCT TABLE ----------------------- */


                if(input){

                    return res.status(200).json({
                        "error": false,
                        "message": "Input created successfully",
                        data: []
                    })

                }
  
            
            }

        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on adding an input",
                error_description: e.toString(),
                route: "/api/input/product/add",
                error_code: "500"
            });
            if(logError){
                return res.status(500).json({
                    error: true,
                    message: 'Unable to complete request at the moment'
                })
            }  
        }

        
    }

    static async getallInputsByUser(req , res){
        try{
            var alluserinputs = await Inputs.findAll({
                where: {
                    user_id: req.params.user_id
                }
            });

            if(alluserinputs.length > 0){

                return res.status(200).json({
                    error : false,
                    message: "All Inputs returned successfully",
                    data : alluserinputs
                })

            }else{

                return res.status(200).json({
                    error : false,
                    message: "User does not have an input product",
                    data : []
                })

            }
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on getting all user Inputs",
                error_description: e.toString(),
                route: "/api/input/getallbyuserid/:user_id",
                error_code: "500"
            });
            if(logError){
                return res.status(500).json({
                    error: true,
                    message: 'Unable to complete request at the moment'
                })
            }  
        }
    }

    static async getallInputs(req , res){
        try{
            var alluserinputs = await Inputs.findAll();

            if(alluserinputs.length > 0){

                return res.status(200).json({
                    error : false,
                    message: "All Inputs returned successfully",
                    data : alluserinputs
                })

            }else{

                return res.status(200).json({
                    error : false,
                    message: "No input products found",
                    data : []
                })

            }
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on getting all Inputs",
                error_description: e.toString(),
                route: "/api/input/getall",
                error_code: "500"
            });
            if(logError){
                return res.status(500).json({
                    error: true,
                    message: 'Unable to complete request at the moment'
                })
            }  
        }
    }

    static async getallInputsByCategory(req , res){
        try{
            var allInputs = await Inputs.findAll({
                where: {
                    category: req.params.category
                }
            });

            if(allInputs.length > 0){

                return res.status(200).json({
                    error : false,
                    message: "All Inputs for this input type returned",
                    data : allInputs
                })

            }else{

                return res.status(200).json({
                    error : false,
                    message: "No input products found for this input type",
                    data : []
                })

            }
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on getting all Inputs by category",
                error_description: e.toString(),
                route: "/api/input/getallbycategory/:category",
                error_code: "500"
            });
            if(logError){
                return res.status(500).json({
                    error: true,
                    message: 'Unable to complete request at the moment'
                })
            }  
        }
    }
    static async getallInputsByManufacturer(req , res){
        try{
            var allInputs = await Inputs.findAll({
                where: {
                    manufacture_name: req.params.manufacturer
                }
            });

            if(allInputs.length > 0){

                return res.status(200).json({
                    error : false,
                    message: "All Inputs for this manufacturer returned",
                    data : allInputs
                })

            }else{

                return res.status(200).json({
                    error : false,
                    message: "No input products found for this manufacturer",
                    data : []
                })

            }
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on getting all Inputs by manfacturer",
                error_description: e.toString(),
                route: "/api/input/getallbymanfacturer/:manfacturer",
                error_code: "500"
            });
            if(logError){
                return res.status(500).json({
                    error: true,
                    message: 'Unable to complete request at the moment'
                })
            }  
        }
    }
    static async getallInputsByPackaging(req , res){
        try{
            var allInputs = await Inputs.findAll({
                where: {
                    packaging: req.params.packaging
                }
            });

            if(allInputs.length > 0){

                return res.status(200).json({
                    error : false,
                    message: "All Inputs for this packaging returned",
                    data : allInputs
                })

            }else{

                return res.status(200).json({
                    error : false,
                    message: "No input products found for this packaging",
                    data : []
                })

            }
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on getting all Inputs by packaging",
                error_description: e.toString(),
                route: "/api/input/getallbypackaging/:packaging",
                error_code: "500"
            });
            if(logError){
                return res.status(500).json({
                    error: true,
                    message: 'Unable to complete request at the moment'
                })
            }  
        }
    }
    // static async getallInputsByDeliveryMethod(req , res){}
}

module.exports = InputProducts;
