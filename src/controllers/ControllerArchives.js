class CategoryController{

   
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


class SubCategoryController{

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

}

class NegotiationController{







    /* ---------------------------- * ADMIN SENDS NEGOTIATION MESSAGE * ---------------------------- */
    static async addmsgbyadmin(req , res){

        // return res.status(200).json({
        //     message : "Add Category"
        // });

        const errors = validationResult(req);

        try{
            
            if(!errors.isEmpty()){
                return res.status(400).json({ 
                    error: true,
                    message: "All fields required",
                    data: []
                });
            }
    
            
            // console.log(errors.isEmpty());
            let randomid = crypto.randomBytes(8).toString('hex');
         
            
            
            var negotiation = await Negotiation.create(req.body)
    
            return res.status(200).json({
                "error": false,
                "message": "Message sent",
                "data": negotiation
            })
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on adding admin negotiation message",
                error_description: e.toString(),
                route: "/api/crop/negotiation/admin/add",
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
    /* ---------------------------- * ADMIN SENDS NEGOTIATION MESSAGE * ---------------------------- */


}