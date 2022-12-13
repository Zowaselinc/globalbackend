
const jwt = require("jsonwebtoken");
const { Pricing, Transaction, Order, ErrorLog, Negotiation, CropSpecification, Crop, CropRequest} = require("~database/models");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const Mailer = require('~services/mailer');
const md5  = require('md5');
const { reset } = require("nodemon");
const { use } = require("~routes/api");
const crypto = require('crypto');



class OrderController{

    static async hello(req , res){

        return res.status(200).json({
            message : "Hello Order"
        });
    }


    // createNewOrder
    /* ---------------------------- * CREATE NEW ORDER * ---------------------------- */
    static async createNewOrder(req , res){

        // return res.status(200).json({
            // message : "Create New Order"
            
        // });

        // return res.send(req.body);

        const errors = validationResult(req);

        try{
            
            if(!errors.isEmpty()){
                return res.status(400).json({ 
                    error: true,
                    message: "All fields required",
                    data: []
                });
            }

            const randomid = crypto.randomBytes(16).toString('hex');
          
            // console.log(errors.isEmpty());

            let negotiation_id;
    
            const accept_offer_type = req.body.accept_offer_type;
            const cropId = req.body.crop_id;

            /*************************************************************************************
             * IF NEGOTIATION ID IS SENT FROM PAYLOAD, IT MEANS THE OFFER WAS DIRECTLY ACCEPTED, *
             *               IF NOT THERE WAS A NEGOTIATION BEFORE ACCEPTING OFFER               *
             * *************************************************************************************/ 
            // accept_offer_type is direct or negotiation

            let theproduct;
            
            var findWantedCrops = await Crop.findOne({
                where: { type: "offer", id: req.body.crop_id }
            });

            if(!findWantedCrops){
                return res.status(200).json({
                    error: true,
                    message : "Sorry could not proceed, Crop with this specifications is not found.",
                    data: []
                });
            }else if(accept_offer_type == "" || accept_offer_type == null || accept_offer_type == undefined){
                return res.status(200).json({
                    error: true,
                    message : "Please indicate if you are accepting the offer directly or through a negotiation",
                    data: []
                });
            }else if(accept_offer_type == "direct"){
                // If accept_offer_type=="direct" get the crop details using its id
                negotiation_id = null;
                var findCrop = await Crop.findOne({ 
                    include: [{
                        model: CropSpecification,
                        as: 'crop_specification',
                        order: [['id', 'DESC']],
                        limit: 1,
                    },
                    {
                        model: CropRequest,
                        as: 'crop_request',
                        order: [['id', 'DESC']],
                        limit: 1,
                        
                    }],
                    
                    where: { id: cropId, type: "offer" },
                    order: [['id', 'DESC']]
                });

                theproduct = findCrop;

            }else if(accept_offer_type == "negotiation"){
                
                negotiation_id = parseInt(req.body.negotiation_id);

                const { count, rows } = await Negotiation.findAndCountAll({ 
                    where: { 
                        id: negotiation_id,
                        status: "accepted"
                    } 
                });
    
                if(count<1){
                    return res.status(200).json({
                        error : true,
                        message : `No accepted negotiation offer found`,
                        data : []
                    })
                }else{
                    var findCropNegotiationOffers = await Negotiation.findAndCountAll({ 
                        include: [{
                            model: CropSpecification,
                            as: 'crop_specification',
                            order: [['id', 'DESC']],
                            limit: 1,
                        }],
                        
                        
                        where: { 
                            messagetype: "offer",
                            status:     "accepted"
                        },
                        order: [['id', 'DESC']],
                        attributes: ['sender_id', 'receiver_id', 'crop_id', 'messagetype', 'status', 'created_at'],
                    });
        
                
                    /* --------------------- If fetched the accepted/declined Negotiation Transaction --------------------- */
                    
    
                    const findCrop = await Crop.findOne({ 
                        where: { 
                            id: findCropNegotiationOffers.rows[0].crop_id
                        } 
                    });
    
                    const findCropRequest = await CropRequest.findOne({ 
                        where: { 
                            crop_id: findCropNegotiationOffers.rows[0].crop_id
                        } 
                    });
    

                    var obj = new Object();
                    obj = {
                        "cropData": findCrop,
                        "cropSpecificationData": findCropRequest,
                        "negotiation": findCropNegotiationOffers
                    }

                    theproduct = obj;
                }

            }

            
            var createOrder = await Order.create({
                order_id: "ORD"+randomid,
                buyer_id: req.body.buyer_id,
                buyer_type: req.body.buyer_type,
                negotiation_id: negotiation_id,
                payment_option: req.body.payment_option,
                payment_status: req.body.payment_status,
                product: JSON.stringify(theproduct),
                tracking_details: req.body.tracking_details,
                waybill_details: req.body.waybill_details,
                receipt_note: req.body.receipt_note,
                extra_documents: req.body.extra_documents
            })

    
            return res.status(200).json({
                "error": false,
                "message": "New order created",
                "data": createOrder
            })
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on creating an order",
                error_description: e.toString(),
                route: "/api/crop/order/add",
                error_code: "500"
            });
            return res.status(500).json({
                error: true,
                message: 'Unable to complete request at the moment '+e.toString()
            })
        }

        
    }
    /* ---------------------------- * CREATE NEW ORDER * ---------------------------- */






    /* -------------------------- GET ORDER BY ORDER_ID ------------------------- */
    static async getByOrderId(req , res){

        const errors = validationResult(req);

        try{
            var findOrder = await Order.findOne({ where: { order_id: req.params.orderid } });
            if(findOrder){
                return res.status(200).json({
                    error : false,
                    message : "Order retrieved successfully",
                    data : findOrder
                })
            }else{
                return res.status(400).json({
                    error : true,
                    message : "No order found",
                    data : findOrder
                })
            }
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on getting all orders by order_id",
                error_description: e.toString(),
                route: `/api/crop/order/getbyorderid/${req.params.orderid}`,
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
    /* -------------------------- GET ORDER BY ORDER_ID ------------------------- */






    /* -------------------------- GET ORDER BY BUYER_ID ------------------------- */
    static async getByBuyer(req , res){

        const errors = validationResult(req);

        try{
            var findOrder = await Order.findOne({ where: { buyer_id: req.params.buyerid, buyer_type: req.params.buyertype } });
            if(findOrder){
                return res.status(200).json({
                    error : false,
                    message : "Order retrieved successfully",
                    data : findOrder
                })
            }else{
                return res.status(400).json({
                    error : true,
                    message : "No order found",
                    data : findOrder
                })
            }
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on getting all orders by buyerid",
                error_description: e.toString(),
                route: `/api/crop/order/getbyorder/${req.params.buyerid}/${req.params.buyertype}`,
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
    /* -------------------------- GET ORDER BY BUYER_ID ------------------------- */






    /* -------------------------- GET ORDER BY NEGOTIATION_ID ------------------------- */
    static async getByNegotiationId(req , res){

        try{
            var findOrder = await Order.findOne({ where: { negotiation_id: req.params.negotiationid } });
            if(findOrder){
                return res.status(200).json({
                    error : false,
                    message : "Order retrieved successfully",
                    data : findOrder
                })
            }else{
                return res.status(400).json({
                    error : true,
                    message : "No order found",
                    data : findOrder
                })
            }
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on getting all orders by negotiationId",
                error_description: e.toString(),
                route: `/api/crop/order/getbynegotiationid/${req.params.negotiationid}`,
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
    /* -------------------------- GET ORDER BY NEGOTIATION_ID ------------------------- */







    /* -------------------------- GET ORDER BY PAYMENT STATUS ------------------------- */
    static async getByPaymentStatus(req , res){

        try{
            var findOrder = await Order.findOne({ where: { payment_status: req.params.paymentstatus } });
            if(findOrder){
                return res.status(200).json({
                    error : false,
                    message : "Order retrieved successfully",
                    data : findOrder
                })
            }else{
                return res.status(400).json({
                    error : true,
                    message : "No order found",
                    data : findOrder
                })
            }
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on getting all orders by negotiationId",
                error_description: e.toString(),
                route: `/api/crop/order/paymentstatus/${req.params.paymentstatus}`,
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
    /* -------------------------- GET ORDER BY PAYMENT STATUS ------------------------- */





    /* -------------------------- UPDATE TRACKING DETAILS BY ORDER_ID ------------------------- */
    static async updateTrackingDetailsByOrderId(req , res){

        const errors = validationResult(req);

        try{
            
            if(!errors.isEmpty()){
                return res.status(400).json({ 
                    error: true,
                    message: "All fields required",
                    data: []
                });
            }

            var findOrder = await Order.findOne({ where: { order_id: req.body.order_id } });
            if(findOrder){

                // return res.send(req.body.tracking_details)

                let thetrackingDetails = JSON.stringify(req.body.tracking_details);
                
                var updateOrderTrackingDetails = await Order.update({
                    tracking_details: thetrackingDetails
                }, { where : { order_id: req.body.order_id } });

                return res.status(400).json({
                    error : false,
                    message : "Tracking details updated successfully",
                    data : []
                })

            }else{
                return res.status(400).json({
                    error : true,
                    message : "No order found",
                    data : findOrder
                })
            }
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on updating oder tracking details by orderId",
                error_description: e.toString(),
                route: `/api/crop/order/trackingdetails/updatebyorderid`,
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
    /* -------------------------- UPDATE TRACKING DETAILS BY ORDER_ID ------------------------- */





    /* -------------------------- UPDATE WAYBILL DETAILS BY ORDER_ID  ------------------------- */
    static async updateWaybillDetailsByOrderId(req , res){

        try{
            var findOrder = await Order.findOne({ where: { order_id: req.body.order_id } });
            if(findOrder){

                // return res.send(req.body.tracking_details)

                let theWaybillDetails = JSON.stringify(req.body.waybill_details);
                
                var updateOrderWaybillDetails = await Order.update({
                    waybill_details: theWaybillDetails
                }, { where : { order_id: req.body.order_id } });

                return res.status(400).json({
                    error : false,
                    message : "Waybill order details updated successfully",
                    data : []
                })

            }else{
                return res.status(400).json({
                    error : true,
                    message : "No order found",
                    data : findOrder
                })
            }
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on updated waybill order by orderId",
                error_description: e.toString(),
                route: `/api/crop/order/waybilldetails/updatebyorderid`,
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
    /* -------------------------- UPDATE WAYBILL DETAILS BY ORDER_ID  ------------------------- */


    /* -------------------------------------------------------------------------- */
    /*                                    INPUT                                   */
    /* -------------------------------------------------------------------------- */
    static async createInputOrder(req , res){

        // return res.send(req.body);

        const errors = validationResult(req);

        try{
            
            if(!errors.isEmpty()){
                return res.status(400).json({ 
                    error: true,
                    message: "All fields required",
                    data: []
                });
            }

            const randomid = crypto.randomBytes(16).toString('hex');
                        
            var findtheInput = await Input.findOne({
                where: { id: req.body.input_id }
            });

            if(!findtheInput){
                return res.status(200).json({
                    error: true,
                    message : "Sorry Input does not exist.",
                    data: []
                });
            }

            
            var createOrder = await Order.create({
                order_id: "ORD"+randomid,
                buyer_id: req.body.buyer_id,
                buyer_type: req.body.buyer_type,
                payment_option: req.body.payment_option,
                product: req.body.input_id,
                waybill_details: req.body.waybill_details,
                payment_status: req.body.payment_status,
                extra_documents: "payment processor data"
            })

            
    
            return res.status(200).json({
                "error": false,
                "message": "New input order created",
                "data": { order_id: createOrder.order_id }
            })
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on creating an order",
                error_description: e.toString(),
                route: "/api/input/order/add",
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


    /* ----------------- get all cart added by a specified user ----------------- */
    static async updateOrderPayment(req, res){
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
            var returnedResult = await Order.findOne(req.body,{
                where: {
                    "order_id": req.body.order_id
                }
            });

            if(returnedResult){

                var executeCommand = await Order.update({
                    "payment_status": req.body.payment_status,
                    "extra_documents": JSON.stringify(req.body.extra_documents)
                },{
                    where: {
                        "order_id": req.body.order_id
                    }
                });
                
                return res.status(200).json({
                    error : false,
                    message : "Order updated successfully",
                    data : executeCommand
                })

            }else{
                return res.status(200).json({
                    error : true,
                    message : "Order does not exist",
                    data : []
                })
            }



        }catch(error){
            var logError = await ErrorLog.create({
                error_name: "Error on updating input order",
                error_description: error.toString(),
                route: "/api/input/order/updateinputorder",
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
                var returnedResult = await Order.findAll({
                    attributes:['id','order_id','buyer_id', 'buyer_type', 'payment_option', 'payment_status', 'product', 'tracking_details', 'extra_documents', 'created_at'],
                    where: {
                        "buyer_id": user_id
                    }
                });

                if(returnedResult){

                    return res.status(200).json({
                        error : false,
                        message : "Order history retrieved successfully",
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

module.exports = OrderController;