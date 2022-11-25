
const jwt = require("jsonwebtoken");
const { Pricing, Transaction, Order} = require("~models");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const Mailer = require('~services/mailer');
const { buyers } = require("~database/models");
const md5  = require('md5');
const { reset } = require("nodemon");
const { use } = require("~routes/api");



class OrderController{

    static async order(req, res){
        const errors = validationResult(req);
        console.log(errors.array());
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        const data = req.body;
        console.log(data);

        let ObjModel = await OrderController.saveOrder(data);
        console.log(ObjModel);
        if(!ObjModel){
            return res.status(400).json({
             error : true,
             message : "Invalid request"
            });
         }else{
            return res.status(200).json({
                error : false,
                message : "Successful Placed An Order"
            })
         }
    }

    static async saveOrder(data){
        let order = Order();

        order.order_id = data.orderId;
        order.amount = data.amount;
        order.total_product = data.total_product;
        order.action = data.action;
      
        try{  
            await order.save();
        }catch(e){
            order = {
                error : true,
                message : e.sqlMessage
            }
        }

        return order;
    }
}

module.exports = OrderController;