
const jwt = require("jsonwebtoken");
const { User, Company, Merchant, Partner, Buyer, Agent } = require("~models");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const Mailer = require('~services/mailer');
const md5  = require('md5');
const agent = require("~models/agent");


class UserController{

    static async getAllUsers(req, res){


        var merchants = await Merchant().with('user').all();

        var buyers = await Buyer().with('user').all();

        var agents = await Agent().with('user').all();

        var partners = await Partner().with('user').all();

        var resultSet = [ ...merchants, ...buyers , ...agents, ...partners];

        resultSet = resultSet.sort((a,b) => b.user_id - a.user_id);

        return res.status(200).json({
            error : false,
            message : "Users fetched successfully",
            data : resultSet
        });

    }

    static async getUserByType(req , res){

        var result = [];

        if(req.params.type == "merchant"){
            result = await Merchant().with('user').all();
        }

        if(req.params.type == "buyer"){
            result = await Buyer().with('user').all();
        }

        if(req.params.type == "agent"){
            result = await Agent().with('user').all();
        }

        if(req.params.type == "partner"){
            result = await Partner().with('user').all();
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

        let user = await Merchant().with('user').where({user_id : id}).first();
        user = !user ? await Buyer().with('user').where({user_id : id}).first() : user;
        user = !user ? await Partner().with('user').where({user_id : id}).first() : user;
        user = !user ? await Agent().with('user').where({user_id : id}).first() : user;

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
}

module.exports = UserController;