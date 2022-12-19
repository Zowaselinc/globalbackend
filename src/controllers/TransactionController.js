
const jwt = require("jsonwebtoken");
const { Pricing, Transaction, Order, Negotiation, ErrorLog } = require("~database/models");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const Mailer = require('~services/mailer');
const md5  = require('md5');
const { reset } = require("nodemon");
const { use } = require("~routes/api");

const crypto = require('crypto');



class TransactionController{

    static async hello(req , res){

        return res.status(200).json({
            message : "Hello Transaction"
        });
    }

   
    /* ---------------------------- * CREATE A NEW TRANSACTION * ---------------------------- */
    static async createNewTransaction(req , res){

        // return res.status(200).json({
        //     message : "Add Category"
        // });

        const errors = validationResult(req);

        const thetype = req.body.type;
        const type_id = req.body.type_id;

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
                    type_id : type_id
                }
            });
            
            const randomid = crypto.randomBytes(16).toString('hex');

            if(!transaction){
                transaction = await Transaction.create({
                    transaction_id : "TRANS"+randomid,
                    type : thetype,
                    type_id : type_id,
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

}

module.exports = TransactionController;