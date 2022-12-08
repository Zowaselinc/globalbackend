//Import validation result
const { validationResult } = require('express-validator');
const { Category, ErrorLog, SubCategory } = require('~database/models');
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
                "data": req.body
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
    
            var category = await Category.findOne({ where: { id: req.body.id } });
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
            
            var findcategory = await Category.findOne({ where: { id: req.body.id } });

            if(findcategory){

                var category = await Category.update({
                    name: req.body.name
                }, { where : { id: req.body.id } });

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
            
            var findcategory = await Category.findOne({ where: { id: req.body.id } });

            if(findcategory){

                var category = await Category.destroy({ where : { id: req.body.id } });
                
                if(category){
                    var subcategory = await SubCategory.destroy({ where : { category_id: req.body.id } });
                    
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


    
    /* ------------------------------- INPUT CODE ------------------------------- */
    
    
    static async createCategory(req, res){
        const errors = validationResult(req);
        try{
            if (!errors.isEmpty()) {
                return res.status(400).json({ 
                    error: true,
                    message: "All fields required",
                    data: []
                });
            }
            
            const categoryId = crypto.randomBytes(16).toString("hex");

            var checkCategory = await Category.findOne({ where : { category_name : req.body.category_name, category_type: 'INPUTMARKET' } });
            
            if(!checkCategory){
                
                var category = await Category.create({
                    category_name: req.body.category_name,
                    category_type: "INPUTMARKET",
                    category_id: categoryId
                });
                
                return res.status(200).json({
                    error : false,
                    message : "Category created succesfully",
                    data : []
                })

            }else{

                return res.status(200).json({
                    error : true,
                    message : "Category already exists",
                    data : []
                })

            }
        }catch(error){

            var logError = await ErrorLog.create({
                error_name: "Error on adding Category",
                error_description: error.toString(),
                route: "/api/input/category/add",
                error_code: "500"
            });

            return res.status(500).json({
                error: true,
                message: "Unable to complete the request at the moment",
                data: []
            })
        }
    }

    static async getAllCategories(req, res){

        try{

            var categories = await Category.findAll({
                where: {
                    category_type: "INPUTMARKET"
                },
                attributes: ['category_name', 'category_id', 'created_at']
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
                route: "/api/input/category/getall",
                error_code: "500"
            });

            return res.status(500).json({
                error: true,
                message: "Unable to complete the request at the moment",
                data: []
            });
        }


    }

    static async getCategories(req, res){
        try{
            /* ----------- get the offset and limit and convert to Number type ---------- */
            const categoryLimit = Number(req.params.limit);
            const categoryOffset = Number(req.params.offset);

            if(!isNaN(categoryLimit) && !isNaN(categoryOffset)){

                var categories = await Category.findAll({
                    where: {
                        category_type: "INPUTMARKET"
                    },
                    attributes: ['category_name', 'category_id', 'created_at'],
                    limit: categoryLimit,
                    offset: categoryOffset
                });

                if(categories){

                    return res.status(200).json({
                        error : false,
                        message: "Categories retrieved successfully",
                        data :categories
                    })

                }else{

                    return res.status(200).json({
                        error : true,
                        message: "No categories found",
                        data : []
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
                route: "/api/input/category/getall/:offset/:limit",
                error_code: "500"
            });

            return res.status(500).json({
                error: true,
                message: "Unable to complete the request at the moment",
                data: []
            })
        }

    }

    static async getCategoryById(req, res){
        try{
            /* ----------------- the category id supplied as a get param ---------------- */
            const categoryId = req.params.id;

            if(categoryId !== "" || categoryId !== null || categoryId !== undefined){

                var categories = await Category.findOne({
                    attributes: ['category_name', 'category_id', 'created_at'],
                    where: {
                        category_type: "INPUTMARKET",
                        category_id: categoryId
                    }
                });

                if(categories){

                    return res.status(200).json({
                        error : false,
                        message: "Category retrieved successfully",
                        data :[]
                    })

                }else{

                    return res.status(400).json({
                        error : true,
                        message: "Selected Category does not exist",
                        data : []
                    })

                }


            }else{

                return res.status(200).json({
                    error : true,
                    message : "Please supply a valid category id",
                    data: []
                })

            }
        }catch(error){
            var logError = await ErrorLog.create({
                error_name: "Error on getting category by categoryId",
                error_description: error.toString(),
                route: "/api/input/category/getcategorybyid/:id",
                error_code: "500"
            });

            return res.status(500).json({
                error: true,
                message: "Unable to complete the request at the moment",
                data: []
            })
        }

    }

    static async updateCategory(req, res){
        const errors = validationResult(req);
        try{
            if (!errors.isEmpty()) {
                return res.status(400).json({ 
                    error: true,
                    message: "All fields required",
                    data: []
                });
            }

            var checkCategory = await Category.findOne({ where : { category_id : req.body.id } });
            
            if(checkCategory){
                
                var category = await Category.update({
                    category_name: req.body.category_name
                }, {
                    where: {
                        category_id: req.body.id,
                        category_type: "INPUTMARKET"
                    }
                });
                
                return res.status(200).json({
                    error : false,
                    message : "Category updated succesfully",
                    data : []
                })

            }else{

                return res.status(200).json({
                    error : true,
                    message : "The category does not exist",
                    data : []
                })

            }
        }catch(error){
            var logError = await ErrorLog.create({
                error_name: "Error on adding Category",
                error_description: error.toString(),
                route: "/api/input/category/update",
                error_code: "500"
            });

            return res.status(500).json({
                error: true,
                message: "Unable to complete the request at the moment",
                data: []
            })
        }
    }

    static async deleteCategory(req, res){

        const errors = validationResult(req);
        try{
            if (!errors.isEmpty()) {
                return res.status(400).json({ 
                    error: true,
                    message: "Please provide a category id",
                    data: []
                });
            }

            var categories = await Category.findOne({
                attributes: ['category_id'],
                where: {
                    category_type: "INPUTMARKET",
                    category_id: req.body.id
                }
            });

            if(categories){

                var category = await Category.destroy({ where : {category_id : req.body.id}})
        
                return res.status(200).json({
                    error : false,
                    message : "Category deleted succesfully",
                })

            }else{
                return res.status(200).json({
                    error : true,
                    message : "No category with id found"
                })
            }
    

        }catch(error){
            var logError = await ErrorLog.create({
                error_name: "Error on deleting category by categoryId",
                error_description: error.toString(),
                route: "/api/input/category/delete",
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

module.exports = CategoryController;
