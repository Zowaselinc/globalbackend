
const jwt = require("jsonwebtoken");
const { Pricing, Transaction } = require("~models");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const Mailer = require('~services/mailer');
const { buyers } = require("~database/models");
const md5  = require('md5');
const { reset } = require("nodemon");
const { use } = require("~routes/api");



class TransactionController{

    static async pricing(req, res){
        const errors = validationResult(req);
        console.log(errors.array());
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        const data = req.body;
        console.log(data);

        let pricingObjModel = await TransactionController.savePricing(data);
        console.log(pricingObjModel);
        if(!pricingObjModel){
            return res.status(400).json({
             error : true,
             message : "Invalid request"
            });
         }else{
            return res.status(200).json({
                error : false,
                message : "Successful Selected Pricing Plan"
            })
         }
    }

    static async transaction(req, res){
        const errors = validationResult(req);
        console.log(errors.array());
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        const data = req.body;
        console.log(data);

        let transactionObjModel = await TransactionController.saveTransaction(data);
        console.log(transactionObjModel);
        if(!transactionObjModel){
            return res.status(400).json({
             error : true,
             message : "Invalid request"
            });
         }else{
            return res.status(200).json({
                error : false,
                message : "Transaction Sucessful"
            })
         }
    }

    static async saveTransaction(data){
        let transaction = Transaction();

        transaction.transaction_id = data.transaction_ref;
        transaction.amount = data.amount;
        transaction.method = data.method;
        transaction.type = data.type;
        transaction.status = data.status;
      
        try{  
            await transaction.save();
        }catch(e){
            transaction = {
                error : true,
                message : e.sqlMessage
            }
        }

        return transaction;
    }

    static async savePricing(data){
        let pricing = Pricing();

        pricing.user_id = data.userId;
        pricing.client_id = data.clientId;
        pricing.package = data.type;
      
        try{  
            await pricing.save();
        }catch(e){
            pricing = {
                error : true,
                message : e.sqlMessage
            }
        }

        return pricing;
    }
}

module.exports = TransactionController;