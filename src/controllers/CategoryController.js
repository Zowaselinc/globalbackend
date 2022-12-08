//Import validation result
const { validationResult } = require('express-validator');
const { Category, ErrorLog } = require('~database/models');
const crypto = require('crypto');

class CategoryController{

    static async hello(req , res){

        return res.status(200).json({
            message : "Hello Category"
        });
    }

   
    /* ---------------------------- * ADD CATEGORY * ---------------------------- */
    static async add(req , res){

        // return res.status(200).json({
        //     message : "Add Category"
        // });

        const errors = validationResult(req);

        try{
            
            if(!errors.isEmpty()){
                return res.status(400).json({ errors: errors.array() });
            }
    
            
            // console.log(errors.isEmpty());
            let randomid = crypto.randomBytes(8).toString('hex');
            var category = await Category.create({
                name: req.body.name,
                type: "cropmarket",
                category_id: "CROPMARKETCATEG"+randomid
            })
    
            return res.status(200).json({
                "error": false,
                "message": "Category created successfully",
                "category": category
            })
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on adding category",
                error_description: e.toString(),
                route: "/api/crop/category/add",
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
    /* ---------------------------- * ADD CATEGORY * ---------------------------- */





    /* --------------------------- GET ALL CATEGORIES --------------------------- */
    static async getall(req , res){

        // return res.status(200).json({
        //     message : "GET ALL Category"
        // });

        try{
            var categories = await Category.findAll();

            return res.status(200).json({
                error : false,
                data : categories
            })
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on getting all categories",
                error_description: e.toString(),
                route: "/api/crop/category/getall",
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
    /* --------------------------- GET ALL CATEGORIES --------------------------- */







    /* --------------------------- GET ALL CATEGORIES BY LIMIT --------------------------- */
    static async getallbyLimit(req , res){

        // return res.status(200).json({
        //     message : "GET ALL Category BY OFFSET "+req.params.offset+" & LIMIT"+req.params.limit
        // });

        const offset = parseInt(req.params.offset);
        const limit = parseInt(req.params.limit);

        try{
            var categories = await Category.findAll({ offset: offset, limit: limit });

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
    static async getbyid(req , res){

        // return res.status(200).json({
        //     message : "GET Category By Category ID"
        // });

        const errors = validationResult(req);

        try{
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
    
            var category = await Category.findOne({ where: { category_id: req.body.id } });
            if(category){
                return res.status(200).json({
                    error : false,
                    message : "Single category grabbed successfully",
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







    /* --------------------------- EDIT CATEGORIES BY CATEGORY ID --------------------------- */
    static async editbyid(req , res){

        // return res.status(200).json({
        //     message : "GET Category By Category ID"
        // });

        const errors = validationResult(req);

        try{
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            
            var findcategory = await Category.findOne({ where: { category_id: req.body.id } });

            if(findcategory){

                var category = await Category.update({
                    name: req.body.name
                }, { where : { category_id: req.body.id } });

                if(category){
                    return res.status(200).json({
                        error : false,
                        message : "Category edited successfully",
                        category : req.body.name
                    })
                }else{
                    return res.status(400).json({
                        error : true,
                        message : "Failed to edit category"
                    })
                }
                
            }else{
                return res.status(400).json({
                    error : true,
                    message : "No category found",
                    category : category
                })
            }
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on editing a category",
                error_description: e.toString(),
                route: "/api/crop/category/editbyid",
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
    /* --------------------------- EDIT CATEGORIES BY CATEGORY ID --------------------------- */








    /* --------------------------- DELETE CATEGORY BY CATEGORY ID --------------------------- */
    static async deletebyid(req , res){

        // return res.status(200).json({
        //     message : "GET Category By Category ID"
        // });

        const errors = validationResult(req);

        try{
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            
            var findcategory = await Category.findOne({ where: { category_id: req.body.id } });

            if(findcategory){

                var category = await Category.destroy({ where : { category_id: req.body.id } });

                if(category){
                    return res.status(200).json({
                        error : false,
                        message : "Category deleted successfully",
                        category : req.body.name
                    })
                }else{
                    return res.status(400).json({
                        error : true,
                        message : "Failed to delete category"
                    })
                }
                
            }else{
                return res.status(400).json({
                    error : true,
                    message : "No category as this is found",
                    category : category
                })
            }
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on deleting a category",
                error_description: e.toString(),
                route: "/api/crop/category/deletebyid",
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
    /* --------------------------- DELETE CATEGORY BY CATEGORY ID --------------------------- */

}

module.exports = CategoryController;
