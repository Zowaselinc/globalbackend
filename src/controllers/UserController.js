
const jwt = require("jsonwebtoken");
const { User, Company, Merchant, Partner, Buyer, Agent, Product, ProductRequest } = require("~database/models");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const Mailer = require('~services/mailer');
const md5  = require('md5');


class UserController{

    static async getAllUsers(req, res){


        var merchants = await Merchant.findAll({ include : User});

        var buyers = await Buyer.findAll({ include : User});

        var agents = await Agent.findAll({ include : User});

        var partners = await Partner.findAll({ include : User});

        var resultSet = [ ...merchants, ...buyers , ...agents, ...partners];

        resultSet = resultSet.sort((a,b) => b.user_id - a.user_id);

        return res.status(200).json({
            error : false,
            message : "Users fetched successfully",
            data : resultSet
        });

    }

    static async getUsersByType(req , res){

        var result = [];

        if(req.params.type == "merchant"){
            result = await Merchant.findAll({ include : User });
        }

        if(req.params.type == "buyer"){
            result = await Buyer.findAll({ include : User});
        }

        if(req.params.type == "agent"){
            result = await Agent.findAll({ include : User});
        }

        if(req.params.type == "partner"){
            result = await Partner.findAll({ include : User});
        }


        result = result.sort((a,b) => b.user_id - a.user_id);

        return res.status(200).json({
            error : false,
            message : "Users fetched successfully",
            data : result
        });
    }


    static async getUserById(req , res){

        var id = req.params.id;

        var userTypeMap = {
            merchant : Merchant,
            corporate : Buyer,
            agent : Agent,
            partner : Partner
        };

        let user = await User.findByPk(id);

        if(user){
            user = await userTypeMap[user.type].findOne({ where : {user_id : id} , include : User});
        }

        if(!user){
            return res.status(400).json({
                error : true,
                message : "User not found",
            });
        }


        return res.status(200).json({
            error : false,
            message : "User fetched successfully",
            data : user
        });
    }


    static async getUserStats(req ,res){
        
    }
}

module.exports = UserController;
