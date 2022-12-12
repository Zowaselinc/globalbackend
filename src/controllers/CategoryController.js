//Import validation result
const { validationResult } = require('express-validator');
const { Category, ErrorLog, SubCategory, Crop, Input } = require('~database/models');
const crypto = require('crypto');
const { count } = require('console');
const { Sequelize } = require('sequelize');

class CategoryController{

    static async hello(req , res){

        return res.status(200).json({
            message : "Hello Category"
        });
    }


    /* --------------------------- GET ALL CATEGORIES --------------------------- */


    static async getAllCategories(req, res){

        try{

            var countOptions = {
                attributes: { 
                    include: [[Sequelize.fn("COUNT", Sequelize.col(`${req.params.type}s.id`)), `count`]] 
                },
                include: [{
                    model: req.params.type == "crop" ? Crop : Input,
                    attributes: []
                }],
                group: ['Category.id']
            };

            var categories = await Category.findAll({
                where: {
                    type: req.params.type
                },
                ...countOptions
            });

            if(categories.length > 0){
    
                return res.status(200).json({
                    error : false,
                    message: "Categories returned successfully",
                    data : categories
                })

            }else{

                return res.status(200).json({
                    error : true,
                    message: "No categories found",
                    data : []
                })

            }

        }catch(error){
            var logError = await ErrorLog.create({
                error_name: "Error on getting all Categories",
                error_description: error.toString(),
                route: `/category/${req.params.type}/getall`,
                error_code: "500"
            });

            return res.status(500).json({
                error: true,
                message: "Unable to complete the request at the moment",
                data: []
            });
        }


    }

    /* --------------------------- GET ALL CATEGORIES --------------------------- */
    
    


    /* --------------------------- GET ALL CATEGORIES BY LIMIT --------------------------- */
    static async getAllByLimit(req , res){


        const offset = parseInt(req.params.offset);
        const limit = parseInt(req.params.limit);

        try{
            var categories = await Category.findAll({ 
                offset: offset, 
                limit: limit,
                where : {
                    type : req.params.type
                }
            });

            return res.status(200).json({
                error : false,
                data : categories
            })
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on getting all categories by limit and offset",
                error_description: e.toString(),
                route: "/api/crop/category/getall/:offset/:limit",
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
    /* --------------------------- GET ALL CATEGORIES BY LIMIT --------------------------- */





    /* --------------------------- GET CATEGORIES BY CATEGORY ID --------------------------- */
    static async getById(req , res){

        try{
            var category = await Category.findOne({ where: { id: req.body.id } });
            if(category){
                return res.status(200).json({
                    error : false,
                    message : "Category grabbed successfully",
                    category : category
                })
            }else{
                return res.status(400).json({
                    error : false,
                    message : "No category found",
                    category : category
                })
            }
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on getting all categories by id",
                error_description: e.toString(),
                route: "/api/crop/category/getbyid",
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
    /* --------------------------- GET CATEGORIES BY CATEGORY ID --------------------------- */


}

module.exports = CategoryController;
