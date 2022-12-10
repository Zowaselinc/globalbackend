const { request } = require("express");
const { DeliveryAddress, ErrorLog } = require("~database/models");
const { validationResult } = require("express-validator");
const crypto = require("crypto");
// const jwt = require("jsonwebtoken");

class ShippingAddress{

    static async createDeliveryAddress(req, res){
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

            /* ---------------- check if the address already exists for that user ---------------- */
            var checkAddress = await DeliveryAddress.findOne({
                where: {
                    "user_id":req.body.user_id
                }
            });

            if(checkAddress){
                /* ------------------------- update existing record ------------------------- */
                var makeRequest = await DeliveryAddress.update(req.body, {
                    where: {
                        "user_id":req.body.user_id
                    }
                });
            }else{
                /* --------------------- insert the product into the DB --------------------- */
                var makeRequest = await DeliveryAddress.create(req.body);
            }
                
            if(makeRequest){
                return res.status(200).json({
                    error : false,
                    message : "Delivery Address added successfully",
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
                error_name: "Error on creating delivery address",
                error_description: error.toString(),
                route: "/api/input/deliveryaddress/add",
                error_code: "500"
            });

            return res.status(500).json({
                error: true,
                message: "Unable to complete the request at the moment",
                data: []
            })
        }
        
    }

    /* ----------------- get all cart added by a specified user ----------------- */
    static async getAllUserDeliveryAdresses(req, res){
        try{

            /* ----------------- the user id supplied as a get param ---------------- */
            const userid = req.params.user_id;

            if(userid !== "" || userid !== null || userid !== undefined){            

                /* ---------------- check if the item is already in the cart ---------------- */
                var returnedResult = await DeliveryAddress.findAll({
                    where: {
                        "user_id": userid
                    }
                });

                if(returnedResult.length > 0){
                    
                    return res.status(200).json({
                        error : false,
                        message : "Delivery Address retrieved successfully",
                        data : returnedResult
                    })

                }else{
                    return res.status(200).json({
                        error : true,
                        message : "Unable to complete the request at the moment",
                        data : []
                    })
                }
            }else{
                return res.status(200).json({
                    error : true,
                    message : "Invalid user id",
                    data : []
                })
            }



        }catch(error){
            var logError = await ErrorLog.create({
                error_name: "Error on getting all user delivery addresses",
                error_description: error.toString(),
                route: "/api/input/deliveryaddress/getallbyuserid/:user_id",
                error_code: "500"
            });

            return res.status(500).json({
                error: true,
                message: "Unable to complete the request at the moment",
                data: []
            })
        }
        
    }
    
    static async deleteDeliveryAddress(req, res){
        try{

            /* ----------------- the user id supplied as a get param ---------------- */
            const id = req.params.id;

            if(id !== "" || id !== null || id !== undefined){            

                /* ---------------- check if the delivery address exists ---------------- */
                var returnedResult = await DeliveryAddress.findOne({
                    where: {
                        "id": id
                    }
                });

                if(returnedResult){

                    var deleteit = await DeliveryAddress.destroy({
                        where: {
                            "id": id
                        }
                    })

                    if(deleteit){

                        return res.status(200).json({
                            error : false,
                            message : "Delivery Address deleted successfully",
                            data : []
                        })

                    }else{

                        return res.status(400).json({
                            error : true,
                            message : "Invalid request.",
                            data : []
                        })

                    }
                    

                }else{
                    return res.status(200).json({
                        error : true,
                        message : "Delivery Address does not exist",
                        data : []
                    })
                }
            }else{
                return res.status(400).json({
                    error : true,
                    message : "Invalid user id",
                    data : []
                })
            }



        }catch(error){
            var logError = await ErrorLog.create({
                error_name: "Error on deleting user delivery address",
                error_description: error.toString(),
                route: "/api/input/deliveryaddress/delete/:id",
                error_code: "500"
            });

            return res.status(500).json({
                error: true,
                message: "Unable to complete the request at the moment",
                data: []
            })
        }
    }

}

module.exports = ShippingAddress;