const { request } = require("express");
const { ErrorLog } = require("~database/models");
const { validationResult } = require("express-validator");
const crypto = require("crypto");
// const jwt = require("jsonwebtoken");

class InputCrops{

    static async createCrop(req , res){

        let sampleFile;
        let uploadPath;

        const errors = validationResult(req);

        let randomid = crypto.randomBytes(8).toString('hex');
        
        try{

            if(!errors.isEmpty()){
                return res.status(200).json({
                    "error": true,
                    "message": "All fields are required",
                    "data": []
                }) 
            }

            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(200).json({
                    "error": true,
                    "message": "No files were uploaded."
                })
            
            }else{
                
                
                let allImages = Object.keys(req.files);

                /* -------------------------- MOVE UPLOADED FOLDER -------------------------- */
                let my_object = [];
                for(let i = 0; i < allImages.length; i++ ){
                    
                    my_object.push(req.files[allImages[i]].name);
                    sampleFile = req.files[allImages[i]];
                    uploadPath = `${__dirname} / ${req.files[allImages[i]].name}`;

                    sampleFile.mv(uploadPath, function(err) {
                        if (err){
                            return res.status(500).send(err);
                        }else{}
                    });
                }
                /* -------------------------- MOVE UPLOADED FOLDER -------------------------- */


                /* ------------------------ INSERT INTO PRODUCT TABLE ----------------------- */
               
                var input = await InputCrops.create({
                    user_id: req.body.user_id,
                    category: req.body.category,
                    sub_category: req.body.sub_category,
                    crop_focus: req.body.crop_focus,
                    packaging: req.body.packaging,
                    description: req.body.description,
                    usage_instruction: req.body.usage_instruction,
                    kg: req.body.kg,
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


                if(product){

                    return res.status(200).json({
                        "error": false,
                        "message": "Input created successfully",
                        data: []
                    })

                }
  
            
            }

        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on add a product",
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

}

// module.exports = InputCrops;