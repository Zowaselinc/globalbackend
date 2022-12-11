
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
            
            // if(!errors.isEmpty()){
            //     return res.status(400).json({ 
            //          errors: errors.array() 
            //     });
            // }

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

}

module.exports = OrderController;