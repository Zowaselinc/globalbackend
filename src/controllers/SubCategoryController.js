//Import validation result
const { validationResult } = require('express-validator');
const { SubCategory, ErrorLog } = require('~database/models');
const crypto = require('crypto');

class SubCategoryController{

    static async hello(req , res){

        return res.status(200).json({
            message : "Hello SubCategory"
        });
    }





    /* --------------------------- GET SUBCATEGORIES BY CATEGORY --------------------------- */
    static async getByCategory(req , res){

        const subcategoryLimit = req.query.limit ? Number(req.query.limit) : null;
        const subcategoryOffset = req.query.offset ? Number(req.query.offset) : null;

        var filterOptions = {};

        if(subcategoryLimit && !isNaN(subcategoryLimit)){
            filterOptions.limit = subcategoryLimit;
        }
        if(subcategoryOffset && !isNaN(subcategoryOffset)){
            filterOptions.offset = subcategoryOffset
        }


        try{
            const { count, rows } = await SubCategory.findAndCountAll({ 
                where: { category_id: req.params.categoryId },
                ...filterOptions
            });

            if(count < 1){
                return res.status(200).json({
                    "error": true,
                    "message": "No Subcategory found"
                })
            }else{
                return res.status(200).json({
                    "error" : false,
                    "message": "Subcategories grabbed successfully",
                    "data" : rows
                })
            }
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on getting subcategory from category id",
                error_description: e.toString(),
                route: "/api/crop/subcategory/getbycategory",
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
    /* --------------------------- GET SUBCATEGORIES BY CATEGORY --------------------------- */








    /* --------------------------- GET ONE SUBCATEGORY BY SUBCATEGORY ID --------------------------- */
    static async getById(req , res){
        try{
            var subcategory = await SubCategory.findOne({ where: { id: req.params.id } });
            if(subcategory){
                return res.status(200).json({
                    error : false,
                    message : "Single subcategory grabbed successfully",
                    subcategory : subcategory
                })
            }else{
                return res.status(200).json({
                    error : true,
                    message : "No subcategory found",
                })
            }
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on getting subcategory by id",
                error_description: e.toString(),
                route: "/api/crop/subcategory/getbyid",
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
    /* --------------------------- GET ONE SUBCATEGORY BY SUBCATEGORY ID --------------------------- */


    static async getSubCategoriesLimit(req, res){
        try{
            /* ----------- get the offset and limit and convert to Number type ---------- */
            const subcategoryLimit = Number(req.params.limit);
            const subcategoryOffset = Number(req.params.offset);

            if(!isNaN(subcategoryLimit) && !isNaN(subcategoryOffset)){

                var subcategories = await Subcategory.findAll({
                    where: {
                        category_id: req.params.categoryId
                    },
                    limit: subcategoryLimit,
                    offset: subcategoryOffset
                });
                
                if(subcategories.length > 0){

                    return res.status(200).json({
                        error : false,
                        message: "SubCategories retrieved successfully",
                        data :subcategories
                    })

                }else{

                    return res.status(200).json({
                        error : true,
                        message: "No subcategories found",
                        data :subcategories
                    })

                }

            }else{

                return res.status(200).json({
                    error : true,
                    message : "URL parameter provided is invalid",
                    data: []
                })

            }
        }catch(error){
            var logError = await ErrorLog.create({
                error_name: "Error on getting all specific categories",
                error_description: error.toString(),
                route: "/api/input/subcategory/getall/:id/:offset/:limit",
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

module.exports = SubCategoryController;
