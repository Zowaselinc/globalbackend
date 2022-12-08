const { request } = require("express");
const { InputProducts, InputCart, ErrorLog } = require("~database/models");
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
                    "product_id": req.body.product_id
                }
            });

            if(checkCart.length > 0){
                /* ------------------------- update existing record ------------------------- */
                var makeRequest = await InputCart.update(req.body, {
                    where: {
                        "user_id":req.body.user_id,
                        "product_id": req.body.product_id
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
                        model: Product,
                        include: {
                            model: ProductSpecs,
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

    // static async getAllProductRequestById(req, res){
        
    //     try{

    //         const productId = req.params.productid;

    //         if(productId !== "" || productId !== null || productId !== undefined){
                
    //             /* --------------------- insert the product into the DB --------------------- */
    //             var requestbyid = await ProductRequest.findOne({ 
    //                 where: {
    //                     product_id: productId,
    //                 },
    //                 attributes: ['product_id', 'state', 'zip', 'country','address', 'delivery_method', 'delivery_date', 'delivery_window', 'created_at']
    //             });

    //             if(requestbyid){

    //                 var getRequestedProduct = await Product.findOne({
    //                     where: {
    //                         id: productId
    //                     }
    //                 })

    //                 if(getRequestedProduct){

    //                     var requestedProductSpec = await ProductSpecs.findOne({
    //                         where: {
    //                             model_id: productId
    //                         }
    //                     })

    //                     return res.status(200).json({
    //                         error : false,
    //                         message : "Product Request retrieved by Product ID",
    //                         data : requestbyid,
    //                         productData: getRequestedProduct,
    //                         productSpecifications: requestedProductSpec
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
    //             route: "/api/input/productrequest/getbybyproductid/:productid",
    //             error_code: "500"
    //         });

    //         return res.status(500).json({
    //             error: true,
    //             message: "Unable to complete the request at the moment",
    //             data: []
    //         })
    //     }
    // }

    // static async getAllProductRequestByState(req, res){
    //     try{

    //         const stateLocated = req.params.state;

    //         if(stateLocated !== "" || stateLocated !== null || stateLocated !== undefined){
                
    //             /* --------------------- insert the product into the DB --------------------- */
    //             var requestbystate = await ProductRequest.findAll({ 
    //                 where: {
    //                     state: stateLocated,
    //                 },
    //                 attributes: ['product_id', 'state', 'zip', 'country','address', 'delivery_method', 'delivery_date', 'delivery_window', 'created_at']
    //             });

    //             if(requestbystate.length > 0){

    //                 for(let i = 0; i < requestbystate.length; i++){
    //                     let productsId = requestbystate[i].product_id;
    //                     var requestReturnedProducts = await Product.findAll({
    //                         where: {
    //                             id: productsId
    //                         }
    //                     })

    //                     var requestReturnedProductSpecs = await ProductSpecs.findAll({
    //                         where: {
    //                             model_id: productsId
    //                         }
    //                     })
    //                 }

    //                 return res.status(200).json({
    //                     error : false,
    //                     message : "Product Request retrieved by State",
    //                     data : requestbystate,
    //                     productData: requestReturnedProducts,
    //                     productSpecifications: requestReturnedProductSpecs

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
    //             route: "/api/input/productrequest/getbybystate/:state",
    //             error_code: "500"
    //         });

    //         return res.status(500).json({
    //             error: true,
    //             message: "Unable to complete the request at the moment",
    //             data: []
    //         })
    //     }
    // }

    // static async getAllProductRequestByZip(req, res){
    //     try{

    //         const zipcode = req.params.zip;

    //         if(zipcode !== "" || zipcode !== null || zipcode !== undefined){
                
    //             /* --------------------- insert the product into the DB --------------------- */
    //             var requestbyzip = await ProductRequest.findAll({ 
    //                 include: [{
    //                     model: ProductSpecs,
    //                     as: 'product_specification'
    //                 },{
    //                     model: Product
    //                 }],
    //                 where: {
    //                     zip: zipcode,
    //                 },
    //                 attributes: ['product_id', 'state', 'zip', 'country','address', 'delivery_method', 'delivery_date', 'delivery_window', 'created_at']
    //             });

    //             if(requestbyzip.length > 0){

    //                 return res.status(200).json({
    //                     error : false,
    //                     message : "Product Request retrieved by Zipcode",
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
    //             route: "/api/input/productrequest/getbybyzip/:zip",
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