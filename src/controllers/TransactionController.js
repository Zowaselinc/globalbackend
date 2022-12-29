
const jwt = require("jsonwebtoken");
const { Pricing, Transaction, Order, Negotiation, ErrorLog } = require("~database/models");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const Mailer = require('~services/mailer');
const md5  = require('md5');
const { reset } = require("nodemon");
const { use } = require("~routes/api");
const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);

const crypto = require('crypto');



class TransactionController{
   
    /* ---------------------------- * CREATE A NEW TRANSACTION * ---------------------------- */
    static async createNewTransaction(req , res){

        // return res.status(200).json({
        //     message : "Add Category"
        // });

        const errors = validationResult(req);

        const thetype = req.body.type;
        const type_id = req.body.type_id;
        const user_id = req.body.user_id;

        try{
            
            if(!errors.isEmpty()){
                // return res.status(400).json({ errors: errors.array() });
                return res.status(400).json({ 
                    error: true,
                    message: "All fields required",
                    data: []
                });
            }

            
            if(thetype == 'order'){
                var order = await Order.findOne({where : {order_id : type_id}});
                if(!order){
                    return res.status(200).json({ "error": true, "message": "Order not found"})
                }
            }
            if(thetype == 'negotiation'){
                var negotiation = await Negotiation.findOne({where : {conversation_id : type_id}});
                if(!negotiation){
                    return res.status(200).json({ "error": true, "message": "Negotiation not found"})
                }
            }
            
            var transaction = await Transaction.findOne({
                where : {
                    type : thetype,
                    type_id : type_id,
                    user_id : user_id
                }
            });
            
            const randomid = crypto.randomBytes(16).toString('hex');

            if(!transaction){
                transaction = await Transaction.create({
                    transaction_id : "TRANS"+randomid,
                    type : thetype,
                    type_id : type_id,
                    user_id : user_id,
                    amount_paid : req.body.amount_paid,
                    status : req.body.status
                });

                return res.status(200).json({
                    "error": false,
                    "message": "Transaction successfully created",
                    "data": req.body
                })
            }else{
                return res.status(200).json({
                    "error": true,
                    "message": "Transaction already exists",
                    "data": []
                })
            }

        }catch(e){
            var logError = await ErrorLog.create({
                error_name: `Error on crating a transaction for ${thetype}`,
                error_description: e.toString(),
                route: "/api/crop/transaction/add",
                error_code: "500"
            });
            return res.status(500).json({
                error: true,
                message: 'Unable to complete request at the moment'
            })
        }

        
    }
    /* ---------------------------- * CREATE A NEW TRANSACTION * ---------------------------- */


    /* ----------------------- VERIFY TRANSACTION PAYMENT ----------------------- */
    static async verifyTransaction(req , res){

        const errors = validationResult(req);

        const transactionId = req.body.transaction_id;
        const transactionRef = req.body.transaction_ref

        try{
            
            if(!errors.isEmpty()){
                return res.status(400).json({ errors: errors.array() });
            }

            
            const payload = {"id": transactionId}
            const response = await flw.Transaction.verify(payload)
             
            if(response.data.status == "successful"){

                // CHECK FOR DUPLICATE TRANSACTION ENTRY

                var transaction = await Transaction.findOne({
                    where : {
                        transaction_id : transactionId,
                        transaction_ref : transactionRef
                    }
                });

                if(!transaction){

                    // CREATE THE TRANSCTION RECORD
                    // CHECK IF TRANSACTION IS FOR ORDER

                    if(req.body.order){

                        var order = await Order.findOne({
                            where : { order_hash : req.body.order }
                        });

                        if(order){

                            // CHECK FOR CORRECT ORDER AMOUNT ON TRANSACTION

                            if(order.total == response.data.amount){

                                order.payment_status = "PAID";
                                await order.save();

                                var transaction = await Transaction.create({
                                    transaction_id : transactionId,
                                    transaction_ref : transactionRef,
                                    type : "order",
                                    type_id : order.id,
                                    amount_paid : response.data.amount,
                                    status : "completed"
                                });
                            }
                        }
                    }

                    return res.status(200).json({
                        "error": false, 
                        "message": "Transaction verified"
                    })
                }else{
                    return res.status(200).json({ "error": true, "message": "Duplicate transaction entry"})
                }
            }else{
                return res.status(200).json({ "error": true, "message": "Transaction not successful"})
            }

        }catch(e){
            var logError = await ErrorLog.create({
                error_name: `Could not verify transaction`,
                error_description: e.toString(),
                route: "/api/transaction/verify",
                error_code: "500"
            });
            return res.status(500).json({
                error: true,
                message: 'Unable to complete request at the moment'
            })
        }

        
    }
    /* ----------------------- VERIFY TRANSACTION PAYMENT ----------------------- */

}

module.exports = TransactionController;