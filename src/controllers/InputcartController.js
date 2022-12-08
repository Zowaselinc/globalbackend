const { request } = require("express");
const { InputCrops, InputCart, ErrorLog } = require("~database/models");
const { validationResult } = require("express-validator");
const crypto = require("crypto");
// const jwt = require("jsonwebtoken");

class InputsCart{

    static async addtoCart(req, res){
        const errors = validationResult(req);
        try{

            /* ----------------- checking the req.body for empty fields ----------------- */
            if (!errors.isEmpty()) {
                return res.status(400).json({ 
                    error: true,
                    message: "All fields required",
                    data: []
                });
            }

            /* ---------------- check if the item is already in the cart ---------------- */
            var checkCart = await InputCart.findAll({
                where: {
                    "user_id":req.body.user_id,
                    "crop_id": req.body.crop_id
                }
            });

            if(checkCart.length > 0){
                /* ------------------------- update existing record ------------------------- */
                var makeRequest = await InputCart.update(req.body, {
                    where: {
                        "user_id":req.body.user_id,
                        "crop_id": req.body.crop_id
                    }
                });
            }else{
                /* --------------------- insert the product into the DB --------------------- */
                var makeRequest = await InputCart.create(req.body);
            }
                
            if(makeRequest){
                return res.status(200).json({
                    error : false,
                    message : "Item added to cart successfully",
                    data : []
                })
            }else{
                return res.status(400).json({
                    error : true,
                    message : "Unable to complete the request at the moment",
                    data : []
                })
            }



        }catch(error){
            var logError = await ErrorLog.create({
                error_name: "Error on adding input to cart-+",
                error_description: error.toString(),
                route: "/api/input/cart/add",
                error_code: "500"
            });

            return res.status(500).json({
                error: true,
                message: "Unable to complete the request at the moment",
                data: []
            })
        }
        
    }

    static async getUserInputCart(req, res){
        const errors = validationResult(req);
        try{

            /* ----------------- the user id supplied as a get param ---------------- */
            const userid = req.params.user_id;

            if(userid !== "" || userid !== null || userid !== undefined){            

                /* ---------------- check if the item is already in the cart ---------------- */
                var returnedResult = await InputCart.findAll({
                    include: [{
                        model: Crop,
                        include: {
                            model: CropSpecs,
                            as: 'product_specification'
                        }
                    }],
                    where: {
                        "user_id": userid
                    }
                });

                if(returnedResult.length > 0){
                    
                    return res.status(200).json({
                        error : false,
                        message : "User cart retrieved successfully",
                        data : returnedResult
                    })

                }else{
                    return res.status(200).json({
                        error : true,
                        message : "Unable to complete the request at the moment",
                        data : returnedResult
                    })
                }
            }else{
                return res.status(200).json({
                    error : true,
                    message : "Invalid user id",
                    data : returnedResult
                })
            }



        }catch(error){
            var logError = await ErrorLog.create({
                error_name: "Error on adding input to cart-+",
                error_description: error.toString(),
                route: "/api/input/cart/add",
                error_code: "500"
            });

            return res.status(500).json({
                error: true,
                message: "Unable to complete the request at the moment",
                data: []
            })
        }
        
    }

    // static async getAllCropRequestById(req, res){
        
    //     try{

    //         const productId = req.params.productid;

    //         if(productId !== "" || productId !== null || productId !== undefined){
                
    //             /* --------------------- insert the product into the DB --------------------- */
    //             var requestbyid = await CropRequest.findOne({ 
    //                 where: {
    //                     crop_id: productId,
    //                 },
    //                 attributes: ['crop_id', 'state', 'zip', 'country','address', 'delivery_method', 'delivery_date', 'delivery_window', 'created_at']
    //             });

    //             if(requestbyid){

    //                 var getRequestedCrop = await Crop.findOne({
    //                     where: {
    //                         id: productId
    //                     }
    //                 })

    //                 if(getRequestedCrop){

    //                     var requestedCropSpec = await CropSpecs.findOne({
    //                         where: {
    //                             model_id: productId
    //                         }
    //                     })

    //                     return res.status(200).json({
    //                         error : false,
    //                         message : "Crop Request retrieved by Crop ID",
    //                         data : requestbyid,
    //                         productData: getRequestedCrop,
    //                         cropSpecifications: requestedCropSpec
    //                     })
    //                 }


    //             }else{

    //                 return res.status(400).json({
    //                     error : true,
    //                     message : "No requests have been made for the selected product at the moment",
    //                     data : []
    //                 })

    //             }
    //         }else{
    //             return res.status(400).json({
    //                 error : true,
    //                 message : "Invalid product ID",
    //                 data : []
    //             })
    //         }



    //     }catch(error){
    //         var logError = await ErrorLog.create({
    //             error_name: "Error on making product request",
    //             error_description: error.toString(),
    //             route: "/api/input/croprequest/getbybyproductid/:productid",
    //             error_code: "500"
    //         });

    //         return res.status(500).json({
    //             error: true,
    //             message: "Unable to complete the request at the moment",
    //             data: []
    //         })
    //     }
    // }

    // static async getAllCropRequestByState(req, res){
    //     try{

    //         const stateLocated = req.params.state;

    //         if(stateLocated !== "" || stateLocated !== null || stateLocated !== undefined){
                
    //             /* --------------------- insert the product into the DB --------------------- */
    //             var requestbystate = await CropRequest.findAll({ 
    //                 where: {
    //                     state: stateLocated,
    //                 },
    //                 attributes: ['crop_id', 'state', 'zip', 'country','address', 'delivery_method', 'delivery_date', 'delivery_window', 'created_at']
    //             });

    //             if(requestbystate.length > 0){

    //                 for(let i = 0; i < requestbystate.length; i++){
    //                     let productsId = requestbystate[i].crop_id;
    //                     var requestReturnedCrops = await Crop.findAll({
    //                         where: {
    //                             id: productsId
    //                         }
    //                     })

    //                     var requestReturnedCropSpecs = await CropSpecs.findAll({
    //                         where: {
    //                             model_id: productsId
    //                         }
    //                     })
    //                 }

    //                 return res.status(200).json({
    //                     error : false,
    //                     message : "Crop Request retrieved by State",
    //                     data : requestbystate,
    //                     productData: requestReturnedCrops,
    //                     cropSpecifications: requestReturnedCropSpecs

    //                 })

    //             }else{

    //                 return res.status(400).json({
    //                     error : true,
    //                     message : "No requests have been made from the selected state at the moment",
    //                     data : []
    //                 })

    //             }
    //         }else{
    //             return res.status(400).json({
    //                 error : true,
    //                 message : "Invalid state supplied",
    //                 data : []
    //             })
    //         }



    //     }catch(error){
    //         var logError = await ErrorLog.create({
    //             error_name: "Error on getting product request by state",
    //             error_description: error.toString(),
    //             route: "/api/input/croprequest/getbybystate/:state",
    //             error_code: "500"
    //         });

    //         return res.status(500).json({
    //             error: true,
    //             message: "Unable to complete the request at the moment",
    //             data: []
    //         })
    //     }
    // }

    // static async getAllCropRequestByZip(req, res){
    //     try{

    //         const zipcode = req.params.zip;

    //         if(zipcode !== "" || zipcode !== null || zipcode !== undefined){
                
    //             /* --------------------- insert the product into the DB --------------------- */
    //             var requestbyzip = await CropRequest.findAll({ 
    //                 include: [{
    //                     model: CropSpecs,
    //                     as: 'product_specification'
    //                 },{
    //                     model: Crop
    //                 }],
    //                 where: {
    //                     zip: zipcode,
    //                 },
    //                 attributes: ['crop_id', 'state', 'zip', 'country','address', 'delivery_method', 'delivery_date', 'delivery_window', 'created_at']
    //             });

    //             if(requestbyzip.length > 0){

    //                 return res.status(200).json({
    //                     error : false,
    //                     message : "Crop Request retrieved by Zipcode",
    //                     data : requestbyzip,
    //                 })

    //             }else{

    //                 return res.status(400).json({
    //                     error : true,
    //                     message : "No requests have been made from the selected zipcode area at the moment",
    //                     data : []
    //                 })

    //             }
    //         }else{
    //             return res.status(400).json({
    //                 error : true,
    //                 message : "Invalid zipcode supplied",
    //                 data : []
    //             })
    //         }



    //     }catch(error){
    //         var logError = await ErrorLog.create({
    //             error_name: "Error on getting product request by zip",
    //             error_description: error.toString(),
    //             route: "/api/input/croprequest/getbybyzip/:zip",
    //             error_code: "500"
    //         });

    //         return res.status(500).json({
    //             error: true,
    //             message: "Unable to complete the request at the moment",
    //             data: []
    //         })
    //     }
    // }

}

module.exports = InputsCart;