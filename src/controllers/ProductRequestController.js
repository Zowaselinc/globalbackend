//Import validation result
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const { Product, ProductRequest, ErrorLog } = require('~database/models');

class ProductRequestController{

    static async hello(req , res){

        return res.status(200).json({
            message : "Hello Product Request"
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

            const { count, rows } = await Product.findAndCountAll({ where: { id: req.body.product_id  } });

            var FindProdRequest = await ProductRequest.findOne({ 
                where: { product_id: req.body.product_id, state: req.body.state, country: req.body.country, address: req.body.address,
                    delivery_method: req.body.delivery_method, delivery_date: req.body.delivery_date, 
                    delivery_window: req.body.delivery_window
                } 
            });


            if(count<1){
                return res.status(200).json({
                    "error": true,
                    "message": "Product does not exits"
                })
            }else{

                if(FindProdRequest){
                    return res.status(200).json({
                        error : true,
                        message : "This details already exists for a product request"
                    })
                }else{
                    var ProdRequest = await ProductRequest.create({
                        product_id: req.body.product_id,
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
                        "message": "Product request created successfully",
                        "Product Request": ProdRequest
                    })
                }

            }  

        }catch(e){ 
            var logError = await ErrorLog.create({
                error_name: "Error on adding product request",
                error_description: e.toString(),
                route: "/api/productrequest/add",
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
        //     message : "GET ALL Product Request"
        // });

        try{
            var Product_Request = await ProductRequest.findAll();

            return res.status(200).json({
                error : false,
                data : Product_Request
            })
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on getting all product request",
                error_description: e.toString(),
                route: "/api/productrequest/getall",
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
            var Product_Request = await ProductRequest.findAll({ offset: offset, limit: limit });

            return res.status(200).json({
                error : false,
                data : Product_Request
            })
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on getting all product request by limit and offset",
                error_description: e.toString(),
                route: "/api/productrequest/:offset/:limit",
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
        //     message : "GET Product Request By ID"
        // });

        const errors = validationResult(req);

        try{
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
    
            var productrequest = await ProductRequest.findOne({ where: { id: req.body.id } });
            if(productrequest){
                return res.status(200).json({
                    error : false,
                    message : "Single project request grabbed successfully",
                    productrequest : productrequest
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
        //     message : "GET Product Request By ID"
        // });

        const errors = validationResult(req);

        try{
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
    
            var productrequest = await ProductRequest.findOne({ where: { product_id: req.body.product_id } });
            if(productrequest){
                return res.status(200).json({
                    error : false,
                    message : "Single project request grabbed successfully",
                    productrequest : productrequest
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
        //     message : "EDIT Product Request By ID"
        // });

        const errors = validationResult(req);

        try{
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            
            var findProductRequest = await ProductRequest.findOne({ where: { id: req.body.id } });

            if(findProductRequest){

                var productRequest = await ProductRequest.update(req.body,{
                    where : { 
                        id: req.body.id 
                    } 
                });

                if(productRequest){
                    return res.status(200).json({
                        error : false,
                        message : "Product request edited successfully",
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

module.exports = ProductRequestController;
