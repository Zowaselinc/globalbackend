const { request } = require("express");
const { DeliveryAddress, Input, InputOrder, ErrorLog } = require("~database/models");
const { validationResult } = require("express-validator");
const crypto = require("crypto");
// const jwt = require("jsonwebtoken");

class InputsOrder{

    static async createInputOrder(req, res){
        const errors = validationResult(req);
        try{

            /* ----------------- checking the req.body for empty fields ----------------- */
            if (!errors.isEmpty()) {
                return res.status(400).json({ 
                    error: true,
                    message: "All fields required",
                    data: errors
                });
            }

            /* ---------------- check if the address already exists for that user ---------------- */
            var checkOrder = await InputOrder.findOne({
                where: {
                    "user_id":req.body.user_id
                }
            });

            if(checkOrder){
                /* ------------------------- update existing record ------------------------- */
                var makeRequest = await InputOrder.update(req.body, {
                    where: {
                        "user_id":req.body.user_id
                    }
                });
            }else{
                /* --------------------- insert the product into the DB --------------------- */
                var makeRequest = await InputOrder.create({
                    "user_id": req.body.user_id,
                    "delivery_address_id": req.body.delivery_address_id,
                    "delivery_method": req.body.delivery_method,
                    "total_price":req.body.total_price,
                    "payment_method": req.body.payment_method,
                    "orders": req.body.orders
                });
            }
                
            if(makeRequest){
                return res.status(200).json({
                    error : false,
                    message : "Order placed successfully",
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
                error_name: "Error on creating input order",
                error_description: error.toString(),
                route: "/api/input/order/add",
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
    static async updateOrderTransactionId(req, res){
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
            var returnedResult = await InputOrder.findOne(req.body,{
                where: {
                    "user_id": req.body.user_id
                }
            });

            if(returnedResult){

                var executeCommand = await InputOrder.update(req.body,{
                    where: {
                        "user_id": req.body.user_id
                    }
                });
                
                return res.status(200).json({
                    error : false,
                    message : "Transaction ID updated successfully",
                    data : []
                })

            }else{
                return res.status(200).json({
                    error : true,
                    message : "User does not exist",
                    data : returnedResult
                })
            }



        }catch(error){
            var logError = await ErrorLog.create({
                error_name: "Error on updating order transaction id",
                error_description: error.toString(),
                route: "/api/input/order/updatetransactionid",
                error_code: "500"
            });

            return res.status(500).json({
                error: true,
                message: "Unable to complete the request at the moment",
                data: []
            })
        }
        
    }
    
    static async getOrderHistoryByUserId(req, res){
        try{

            /* ----------------- the user id supplied as a get param ---------------- */
            const user_id = req.params.user_id;

            if(user_id !== "" || user_id !== null || user_id !== undefined){            

                /* ---------------- check if the delivery address exists ---------------- */
                var returnedResult = await InputOrder.findAll({
                    include: [{
                        model: Input,
                    }],
                    where: {
                        "user_id": user_id
                    }
                });

                if(returnedResult){

                    return res.status(200).json({
                        error : false,
                        message : "Order history deleted successfully",
                        data : returnedResult
                    })
                    

                }else{
                    return res.status(200).json({
                        error : true,
                        message : "No order history found for this user",
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
                error_name: "Error on getting order history",
                error_description: error.toString(),
                route: "/api/input/order/history/getbyuserid/:user_id",
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

module.exports = InputsOrder;