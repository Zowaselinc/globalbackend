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

   
    /* ---------------------------- * ADD SUBCATEGORY * ---------------------------- */
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

            const { count, rows } = await SubCategory.findAndCountAll({ 
                where: { category_id: req.body.category_id, name:req.body.subcategory_name } 
            });

            // console.log(count, "Count");
            // console.log(rows, "Rows");

            if(count > 0){
                return res.status(200).json({
                    "error": true,
                    "message": "Subcategory already exist"
                })
            }else{
                var subcategory = await SubCategory.create({
                    category_id: req.body.category_id,
                    subcategory_name: req.body.subcategory_name,
                    type: "cropmarket",
                    subcategory_id: "CROPMARKETSUBCATEG"+randomid
                })
                
                return res.status(200).json({
                    "error": false,
                    "message": "Subcategory created successfully",
                    "subcategory": subcategory
                })
            }
            
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on adding a subcategory",
                error_description: e.toString(),
                route: "/api/crop/subcategory/add",
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
    /* ---------------------------- * ADD SUBCATEGORY * ---------------------------- */





    /* --------------------------- GET SUBCATEGORIES BY CATEGORY --------------------------- */
    static async getbycategory(req , res){

        // return res.status(200).json({
        //     message : "GET ALL SUBCategory BY CATEGORY"
        // });

        try{
            const { count, rows } = await SubCategory.findAndCountAll({ where: { category_id: req.body.category_id } });

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
    static async getbyid(req , res){

        // return res.status(200).json({
        //     message : "GET Category By Category ID"
        // });

        const errors = validationResult(req);

        try{
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
    
            var subcategory = await SubCategory.findOne({ where: { subcategory_id: req.body.subcategory_id } });
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







    /* --------------------------- EDIT SUBCATEGORIES BY SUBCATEGORY ID --------------------------- */
    static async editbyid(req , res){

        // return res.status(200).json({
        //     message : "EDIT Subcategory By SubCategory ID"+res.body
        // });

        const errors = validationResult(req);

        try{
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
    
            var findsubcategory = await SubCategory.findOne({ where: { subcategory_id: req.body.subcategory_id } });

            if(findsubcategory){

                var subcategory = await SubCategory.update({
                    subcategory_name: req.body.name
                }, { where : { subcategory_id: req.body.subcategory_id } });

                if(subcategory){
                    return res.status(200).json({
                        error : false,
                        message : "Subcategory edited successfully",
                        subcategory : req.body.name
                    })
                }else{
                    return res.status(200).json({
                        error : true,
                        message : "Failed to edit subcategory"
                    })
                }
                
            }else{
                return res.status(200).json({
                    error : true,
                    message : "Subcategory not found"
                })
            }
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on editing a subcategory by id",
                error_description: e.toString(),
                route: "/api/crop/subcategory/editbyid",
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
    /* --------------------------- EDIT SUBCATEGORIES BY SUBCATEGORY ID --------------------------- */








    /* --------------------------- DELETE SUBCATEGORY BY SUBCATEGORY ID --------------------------- */
    static async deletebyid(req , res){

        // return res.status(200).json({
        //     message : "DELETE SubCategory By SubCategory ID"
        // });

        const errors = validationResult(req);

        try{
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            
            var findsubcategory = await SubCategory.findOne({ where: { subcategory_id: req.body.subcategory_id } });

            if(findsubcategory){

                var subcategory = await SubCategory.destroy({ where : { subcategory_id: req.body.subcategory_id } });

                if(subcategory){
                    return res.status(200).json({
                        error : false,
                        message : "Subcategory deleted successfully",
                        subcategory : req.body.name
                    })
                }else{
                    return res.status(400).json({
                        error : true,
                        message : "Failed to delete subcategory"
                    })
                }
                
            }else{
                return res.status(400).json({
                    error : true,
                    message : "No subcategory found",
                    subcategory : subcategory
                })
            }
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on deleting a subcategory",
                error_description: e.toString(),
                route: "/api/crop/subcategory/deletebyid",
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
    /* --------------------------- DELETE SUBCATEGORY BY SUBCATEGORY ID --------------------------- */


    /* ------------------------------- INPUT CODE ------------------------------- */

    static async createSubcategory(req, res){
        const errors = validationResult(req);
        try{
            if (!errors.isEmpty()) {
                return res.status(400).json({ 
                    error: true,
                    message: "All fields required",
                    data: []
                });
            }
            
            const subcategoryId = crypto.randomBytes(16).toString("hex");

            var checkSubcategory = await Subcategory.findOne({ 
                where : { 
                    subcategory_name : req.body.subcategory_name
                } 
            });
            
            if(!checkSubcategory){
                
                var subcategory = await Subcategory.create({
                    subcategory_name: req.body.subcategory_name,
                    category_id: req.body.category_id,
                    subcategory_id: subcategoryId
                });
                
                return res.status(200).json({
                    error : false,
                    message : "SubCategory created succesfully",
                    data : []
                })

            }else{

                return res.status(200).json({
                    error : true,
                    message : "SubCategory already exists",
                    data : []
                })

            }
        }catch(error){

            var logError = await ErrorLog.create({
                error_name: "Error on adding SubCategory",
                error_description: error.toString(),
                route: "/api/input/subcategory/add",
                error_code: "500"
            });

            return res.status(500).json({
                error: true,
                message: "Unable to complete the request at the moment",
                data: []
            })
        }
    }

    static async getAllSubCategories(req, res){

        try{

            var subcategories = await Subcategory.findAll({
                where: {
                    category_id: req.params.id
                },
                attributes: ['subcategory_name', 'subcategory_id', 'category_id', 'created_at']
            });

            if(subcategories.length > 0){

                return res.status(200).json({
                    error : false,
                    message: "Subcategories returned successfully",
                    data : subcategories
                })

            }else{

                return res.status(200).json({
                    error : true,
                    message: "No subcategory available for this category",
                    data : []
                })

            }
    
    

        }catch(error){
            var logError = await ErrorLog.create({
                error_name: "Error on getting all Categories",
                error_description: error.toString(),
                route: "/api/input/subcategory/getallbycategoryid",
                error_code: "500"
            });

            return res.status(500).json({
                error: true,
                message: "Unable to complete the request at the moment",
                data: []
            })
        }


    }

    static async getSubCategories(req, res){
        try{
            /* ----------- get the offset and limit and convert to Number type ---------- */
            const subcategoryLimit = Number(req.params.limit);
            const subcategoryOffset = Number(req.params.offset);

            if(!isNaN(subcategoryLimit) && !isNaN(subcategoryOffset)){

                var subcategories = await Subcategory.findAll({
                    where: {
                        category_id: req.params.id
                    },
                    attributes: ['subcategory_name', 'subcategory_id', 'category_id', 'created_at'],
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

    static async getSubCategoryById(req, res){
        try{
            /* ----------------- the category id supplied as a get param ---------------- */
            const subcategoryId = req.params.id;

            if(subcategoryId !== "" || subcategoryId !== null || subcategoryId !== undefined){

                var onesubcategory = await Subcategory.findOne({
                    attributes: ['subcategory_name', 'subcategory_id', 'category_id', 'created_at'],
                    where: {
                        subcategory_id: "326a56b377208cf7b76b19d63081f3f6"
                    }
                });

                if([onesubcategory].length > 0){

                    return res.status(200).json({
                        error: false,
                        message: "SubCategory retrieved successfully",
                        data: onesubcategory
                    })

                }else{

                    return res.status(200).json({
                        error: true,
                        message: "No subcategory with selected id found",
                        data: [onesubcategory]
                    })

                }


            }else{

                return res.status(200).json({
                    error : true,
                    message : "Please supply a valid subcategory id",
                    data: []
                })

            }
        }catch(error){
            var logError = await ErrorLog.create({
                error_name: "Error on getting category by categoryId",
                error_description: error.toString(),
                route: "/api/input/subcategory/getbyid/:id",
                error_code: "500"
            });

            return res.status(500).json({
                error: true,
                message: "Unable to complete the request at the moment",
                data: []
            })
        }

    }

    // static async updateCategory(req, res){
    //     const errors = validationResult(req);
    //     try{
    //         if (!errors.isEmpty()) {
    //             return res.status(400).json({ 
    //                 error: true,
    //                 message: "All fields required",
    //                 data: []
    //             });
    //         }

    //         var checkSubcategory = await Category.findOne({ where : { category_id : req.body.id } });
            
    //         if(checkSubcategory){
                
    //             var category = await Category.update({
    //                 category_name: req.body.category_name
    //             }, {
    //                 where: {
    //                     category_id: req.body.id,
    //                     category_type: "INPUTMARKET"
    //                 }
    //             });
                
    //             return res.status(200).json({
    //                 error : false,
    //                 message : "Category updated succesfully",
    //                 data : []
    //             })

    //         }else{

    //             return res.status(200).json({
    //                 error : true,
    //                 message : "The category does not exist",
    //                 data : []
    //             })

    //         }
    //     }catch(error){
    //         var logError = await ErrorLog.create({
    //             error_name: "Error on adding Category",
    //             error_description: error.toString(),
    //             route: "/api/input/category/update",
    //             error_code: "500"
    //         });

    //         return res.status(500).json({
    //             error: true,
    //             message: "Unable to complete the request at the moment",
    //             data: []
    //         })
    //     }
    // }

    // static async deleteCategory(req, res){

    //     const errors = validationResult(req);
    //     try{
    //         if (!errors.isEmpty()) {
    //             return res.status(400).json({ 
    //                 error: true,
    //                 message: "Please provide a category id",
    //                 data: []
    //             });
    //         }

    //         var categories = await Category.findOne({
    //             attributes: ['category_name', 'category_id'],
    //             where: {
    //                 category_type: "INPUTMARKET",
    //                 category_id: req.body.id
    //             }
    //         });

    //         if(categories){

    //             var category = await Category.destroy({ where : {category_id : req.body.id}})
        
    //             return res.status(200).json({
    //                 error : false,
    //                 message : "Category deleted succesfully",
    //             })

    //         }else{
    //             return res.status(200).json({
    //                 error : true,
    //                 message : "No category with id found"
    //             })
    //         }
    

    //     }catch(error){
    //         var logError = await ErrorLog.create({
    //             error_name: "Error on deleting category by categoryId",
    //             error_description: error.toString(),
    //             route: "/api/input/category/delete",
    //             error_code: "500"
    //         });

    //         return res.status(500).json({
    //             error: true,
    //             message: "Unable to complete the request at the moment",
    //             data: []
    //         })
    //     }
    // }
}

module.exports = SubCategoryController;
