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
                where: { category_id: req.body.category_id, subcategory_name:req.body.subcategory_name } 
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

}

module.exports = SubCategoryController;
