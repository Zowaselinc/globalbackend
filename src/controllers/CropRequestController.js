//Import validation result
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const { Crop, CropRequest, ErrorLog } = require('~database/models');

class CropRequestController{

    static async hello(req , res){

        return res.status(200).json({
            message : "Hello Crop Request"
        });
    }

   
    /* ---------------------------- * ADD PRODUCT REQUEST * ---------------------------- */
    static async add(req , res){

        // return res.status(200).json({
        //     message : "Add Category"
        // });

        const errors = validationResult(req);

        try{
            
            if(!errors.isEmpty()){
                return res.status(400).json({ errors: errors.array() });
            }
    
            
            // console.log(errors.isEmpty());
            let randomid = crypto.randomBytes(8).toString('hex');

            const { count, rows } = await Crop.findAndCountAll({ where: { id: req.body.crop_id  } });

            var FindProdRequest = await CropRequest.findOne({ 
                where: { crop_id: req.body.crop_id, state: req.body.state, country: req.body.country, address: req.body.address,
                    delivery_method: req.body.delivery_method, delivery_date: req.body.delivery_date, 
                    delivery_window: req.body.delivery_window
                } 
            });


            if(count<1){
                return res.status(200).json({
                    "error": true,
                    "message": "Crop does not exits"
                })
            }else{

                if(FindProdRequest){
                    return res.status(200).json({
                        error : true,
                        message : "This details already exists for a product request"
                    })
                }else{
                    var ProdRequest = await CropRequest.create({
                        crop_id: req.body.crop_id,
                        state: req.body.state,
                        zip: req.body.zip,
                        country: req.body.country,
                        address: req.body.address,
                        delivery_method: req.body.delivery_method,
                        delivery_date: req.body.delivery_date,
                        delivery_window: req.body.delivery_window
                    })
            
                    return res.status(200).json({
                        "error": false,
                        "message": "Crop request created successfully",
                        "Crop Request": ProdRequest
                    })
                }

            }  

        }catch(e){ 
            var logError = await ErrorLog.create({
                error_name: "Error on adding product request",
                error_description: e.toString(),
                route: "/api/croprequest/add",
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
    /* ---------------------------- * ADD PRODUCT REQUEST * ---------------------------- */







    /* --------------------------- GET ALL PRODUCT REQUEST --------------------------- */
    static async getall(req , res){

        // return res.status(200).json({
        //     message : "GET ALL Crop Request"
        // });

        try{
            var Crop_Request = await CropRequest.findAll();

            return res.status(200).json({
                error : false,
                data : Crop_Request
            })
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on getting all product request",
                error_description: e.toString(),
                route: "/api/croprequest/getall",
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
    /* --------------------------- GET ALL PRODUCT REQUEST --------------------------- */







    /* --------------------------- GET ALL PRODUCT REQUEST BY LIMIT --------------------------- */
    static async getallbyLimit(req , res){

        // return res.status(200).json({
        //     message : "GET ALL Category BY OFFSET "+req.params.offset+" & LIMIT"+req.params.limit
        // });

        const offset = parseInt(req.params.offset);
        const limit = parseInt(req.params.limit);

        try{
            var Crop_Request = await CropRequest.findAll({ offset: offset, limit: limit });

            return res.status(200).json({
                error : false,
                data : Crop_Request
            })
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on getting all product request by limit and offset",
                error_description: e.toString(),
                route: "/api/croprequest/:offset/:limit",
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
    /* --------------------------- GET ALL PRODUCT REQUEST BY LIMIT --------------------------- */









    /* --------------------------- GET PRODUCT REQUEST BY ID --------------------------- */
    static async getbyid(req , res){

        // return res.status(200).json({
        //     message : "GET Crop Request By ID"
        // });

        const errors = validationResult(req);

        try{
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
    
            var croprequest = await CropRequest.findOne({ where: { id: req.body.id } });
            if(croprequest){
                return res.status(200).json({
                    error : false,
                    message : "Single project request grabbed successfully",
                    croprequest : croprequest
                })
            }else{
                return res.status(400).json({
                    error : true,
                    message : "No product request found"
                })
            }
        }catch(error){
            return res.status(500).json({
                "error": true,
                "message": error.toString()
            })  
        }
    }
    /* --------------------------- GET PRODUCT REQUEST BY ID --------------------------- */





    /* --------------------------- GET PRODUCT REQUEST BY ID --------------------------- */
    static async getbyproductid(req , res){

        // return res.status(200).json({
        //     message : "GET Crop Request By ID"
        // });

        const errors = validationResult(req);

        try{
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
    
            var croprequest = await CropRequest.findOne({ where: { crop_id: req.body.crop_id } });
            if(croprequest){
                return res.status(200).json({
                    error : false,
                    message : "Single project request grabbed successfully",
                    croprequest : croprequest
                })
            }else{
                return res.status(400).json({
                    error : true,
                    message : "No product request found"
                })
            }
        }catch(error){
            return res.status(500).json({
                "error": true,
                "message": error.toString()
            })  
        }
    }
    /* --------------------------- GET PRODUCT REQUEST BY ID --------------------------- */







     /* --------------------------- EDIT PRODUCT REQUEST BY CATEGORY ID --------------------------- */
     static async editbyid(req , res){

        // return res.status(200).json({
        //     message : "EDIT Crop Request By ID"
        // });

        const errors = validationResult(req);

        try{
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            
            var findCropRequest = await CropRequest.findOne({ where: { id: req.body.id } });

            if(findCropRequest){

                var cropRequest = await CropRequest.update(req.body,{
                    where : { 
                        id: req.body.id 
                    } 
                });

                if(cropRequest){
                    return res.status(200).json({
                        error : false,
                        message : "Crop request edited successfully",
                        product_request : req.body
                    })
                }else{
                    return res.status(400).json({
                        error : true,
                        message : "Failed to edit product request"
                    })
                }
                
            }else{
                return res.status(400).json({
                    error : true,
                    message : "No product request found",
                    category : category
                })
            }
        }catch(error){
            return res.status(500).json({
                "error": true,
                "message": error.toString()
            })  
        }
    }
    /* --------------------------- EDIT PRODUCT REQUEST BY CATEGORY ID --------------------------- */


}

module.exports = CropRequestController;
