//Import validation result
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const { Negotiation, ErrorLog } = require('~database/models');
const { Op } = require('sequelize');
const { request } = require('http');

class NegotiationController{

    static async hello(req , res){

        return res.status(200).json({
            message : "Hello Negotiation"
        });
    }

   
    /* ---------------------------- * ADD NEGOTIATION * ---------------------------- */
    static async add(req , res){

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
            let messsagetype = "text";
            req.body.messsagetype = messsagetype;
            var negotiation = await Negotiation.create(req.body)
    
            return res.status(200).json({
                "error": false,
                "message": "Message sent",
                "data": negotiation
            })
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on adding negotiation message",
                error_description: e.toString(),
                route: "/api/crop/negotiation/add",
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
    /* ---------------------------- * ADD NEGOTIATION * ---------------------------- */








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
            // const sender_id = "0";
            // const receiver_id = "0";
            // const type = "admin";
            // if(req.body.sender_id){
            //     req.body.sender_id = sender_id;
            // }else{req.body.sender_id = sender_id;}
            // if(req.body.receiver_id){
            //     req.body.receiver_id = receiver_id;
            // }else{req.body.receiver_id = receiver_id;}
            
            
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





    /* --------------------------- GET ALL NEGOTIATION BY USERID --------------------------- */
    static async getbyuserid(req , res){

        // return res.status(200).json({
        //     message : "GET ALL Negootiation by userid"
        // });

        try{
            const userId = req.params.userid;

            if(userId !== "" || userId !== null || userId !== undefined){
                
                /* --------------------- insert the product into the DB --------------------- */
                var requestbyuerid = await Negotiation.findAll({ 
                    where: {
                        [Op.or]: [
                            { receiver_id: userId },
                            { sender_id: userId }
                        ]
                    },
                    attributes: ['sender_id', 'receiver_id', 'product_id', 'type','message', 'messagetype', 'status', 'created_at'],
                });

                if(requestbyuerid){

                    return res.status(200).json({
                        error : false,
                        message : "Negotiations and messages retrieved successfully",
                        data : requestbyuerid
                    })

                }else{

                    return res.status(400).json({
                        error : true,
                        message : "No negotiations made by this user",
                        data : []
                    })

                }
            }else{
                return res.status(400).json({
                    error : true,
                    message : "Invalid user ID",
                    data : []
                })
            }
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on getting negotiation",
                error_description: e.toString(),
                route: "/api/crop/negotiation/getbyuserid/:userid",
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
    /* --------------------------- GET ALL NEGOTIATION BY USERID --------------------------- */







    /* ---------------------------- * SEND NEGOTIATION * ---------------------------- */
    static async add(req , res){

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
            let messsagetype = "text";
            req.body.messsagetype = messsagetype;
            var negotiation = await Negotiation.create(req.body)
    
            return res.status(200).json({
                "error": false,
                "message": "Message sent",
                "data": negotiation
            })
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on adding negotiation message",
                error_description: e.toString(),
                route: "/api/crop/negotiation/add",
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
    /* ---------------------------- * SEND NEGOTIATION * ---------------------------- */







    /* --------------------------- ACCEPT NEGOTIATION BY NEGOIATION ID --------------------------- */
    static async acceptNegotiation(req, res){
        
        try{

            const id = req.params.id;

            if(id !== "" || id !== null || id !== undefined){
                
                var acceptNegotiations = await Negotiation.update({
                    status: "accept"
                },{ 
                    where: {
                        id: id
                    },
                    attributes: ['sender_id', 'receiver_id', 'product_id', 'type','message', 'status', 'created_at'],
                });

                if(acceptNegotiations){

                    return res.status(200).json({
                        error : false,
                        message : "Negotiation offer accepted successfully",
                        data : acceptNegotiations
                    })

                }else{

                    return res.status(400).json({
                        error : true,
                        message : "No offer found",
                        data : []
                    })

                }
            }else{
                return res.status(400).json({
                    error : true,
                    message : "Invalid request",
                    data : []
                })
            }



        }catch(error){
            var logError = await ErrorLog.create({
                error_name: "Error on accepting negotiation offer",
                error_description: error.toString(),
                route: "/api/crop/negotiation/decline/:id",
                error_code: "500"
            });

            return res.status(500).json({
                error: true,
                message: "Unable to complete the request at the moment",
                data: []
            })
        }
    }
    /* --------------------------- ACCEPT NEGOTIATION BY NEGOIATION ID --------------------------- */








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

module.exports = NegotiationController;
