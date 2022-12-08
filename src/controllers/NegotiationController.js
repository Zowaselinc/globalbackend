//Import validation result
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const { Negotiation, ErrorLog, CropSpecification } = require('~database/models');
const { Op } = require('sequelize');
const { request } = require('http');

class NegotiationController{

    static async hello(req , res){

        return res.status(200).json({
            message : "Hello Negotiation"
        });
    }

   
    /* ---------------------------- * USER ADD NEGOTIATION MESSAGE * ---------------------------- */
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
    /* ---------------------------- * USER ADD NEGOTIATION MESSAGE * ---------------------------- */








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
                    attributes: ['sender_id', 'receiver_id', 'crop_id', 'type','message', 'messagetype', 'status', 'created_at'],
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
    static async sendNegotiationOffer(req , res){

        // return res.status(200).json({
        //     message : "Add Category"
        // });

        const errors = validationResult(req);

        try{
            
            // if(!errors.isEmpty()){
            //     return res.status(400).json({ 
            //          errors: errors.array() 
            //     });
            // }
            
            var obj = new Object();
            obj = {
                "required_quantity": req.body.required_quantity,
                "offer_price": req.body.offer_price,
                "color": req.body.color,
                "moisture": req.body.moisture,
                "foreign_matter": req.body.foreign_matter,
                "broken_grains": req.body.broken_grains,
                "weevil": req.body.weevil,
                "dk": req.body.dk,
                "rotten_shriveled": req.body.rotten_shriveled,
                "test_weight": req.body.test_weight,
                "hectoliter": req.body.hectoliter,
                "hardness": req.body.hardness,
                "splits": req.body.splits,
                "oil_content": req.body.oil_content,
                "infestation":  req.body.infestation,
                "grain_size": req.body.grain_size,
                "total_defects": req.body.total_defects,
                "dockage": req.body.dockage, 
                "ash_content": req.body.ash_content, 
                "acid_ash": req.body.acid_ash,
                "volatile": req.body.volatile,
                "mold": req.body.mold, 
                "drying_process": req.body.drying_process,
                "dead_insect": req.body.dead_insect, 
                "mammalian": req.body.mammalian,
                "infested_by_weight": req.body.infested_by_weight,
                "curcumin_content": req.body.curcumin_content,
                "extraneous": req.body.extraneous,
                "kg": req.body.kg,
                "liters": req.body.liters
            }

            let stringifiedObj = JSON.stringify(obj);
            
            // return res.send(aa);

            // console.log(errors.isEmpty());
            let randomid = crypto.randomBytes(8).toString('hex');
            
            var sendnegotiation = await Negotiation.create({
                sender_id: req.body.sender_id,
                receiver_id: req.body.receiver_id,
                crop_id: req.body.crop_id,
                type: req.body.type,
                message: stringifiedObj,
                messagetype: "offer"
            })


            // SEND INFORMATION TO PRODUCT SPECIFICATION TABLE //
            if(sendnegotiation){
                var createCropSpecification = await CropSpecification.create({
                    model_id: sendnegotiation.id,
                    model_type: "offer",
                    qty: req.body.required_quantity,
                    price: req.body.price,
                    color: req.body.color,
                    moisture: req.body.moisture,
                    foreign_matter: req.body.foreign_matter,
                    broken_grains: req.body.broken_grains,
                    weevil: req.body.weevil,
                    dk: req.body.dk,
                    rotten_shriveled: req.body.rotten_shriveled,
                    test_weight: req.body.test_weight,
                    hectoliter: req.body.hectoliter,
                    hardness: req.body.hardness,
                    splits: req.body.splits,
                    oil_content: req.body.oil_content,
                    infestation: req.body.infestation,
                    grain_size: req.body.grain_size,
                    total_defects: req.body.total_defects,
                    dockage: req.body.dockage,
                    ash_content: req.body.ash_content,
                    acid_ash: req.body.acid_ash,
                    volatile: req.body.volatile,
                    mold: req.body.mold,
                    drying_process: req.body.drying_process,
                    dead_insect: req.body.dead_insect,
                    mammalian: req.body.mammalian,
                    infested_by_weight: req.body.infested_by_weight,
                    curcumin_content: req.body.curcumin_content,
                    extraneous: req.body.extraneous,
                    kg: req.body.kg,
                    liters: req.body.liters
                })
            }
            // SEND INFORMATION TO PRODUCT SPECIFICATION TABLE //

            
    
            return res.status(200).json({
                "error": false,
                "message": "New negotiation offer sent",
                "data": sendnegotiation
            })
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on sending a new negotiation offer",
                error_description: e.toString(),
                route: "/api/crop/negotiation/sendoffer",
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

        // return res.status(200).json({
        //     message : "Accept Negotiation"
        // });
        
        try{

            const id = parseInt(req.body.id);

            if(id !== "" || id !== null || id !== undefined){
                
                var acceptNegotiations = await Negotiation.update({
                    status: "accepted"
                },{ 
                    where: {
                        id: id
                    },
                    attributes: ['sender_id', 'receiver_id', 'crop_id', 'type','message', 'status', 'created_at'],
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
                route: "/api/crop/negotiation/accept",
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








    /* --------------------------- DECLINE NEGOTIATION BY NEGOIATION ID --------------------------- */
    static async declineNegotiation(req, res){

        // return res.status(200).json({
        //     message : "Accept Negotiation"
        // });
        
        try{

            const id = parseInt(req.body.id);

            if(id !== "" || id !== null || id !== undefined){
                
                var declineNegotiations = await Negotiation.update({
                    status: "declined"
                },{ 
                    where: {
                        id: id
                    },
                    attributes: ['sender_id', 'receiver_id', 'crop_id', 'type','message', 'status', 'created_at'],
                });

                if(declineNegotiations){

                    return res.status(200).json({
                        error : false,
                        message : "Negotiation offer declined successfully",
                        data : declineNegotiations
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
                error_name: "Error on declining negotiation offer",
                error_description: error.toString(),
                route: "/api/crop/negotiation/decline",
                error_code: "500"
            });

            return res.status(500).json({
                error: true,
                message: "Unable to complete the request at the moment",
                data: []
            })
        }
    }
    /* --------------------------- DECLINE NEGOTIATION BY NEGOIATION ID --------------------------- */




}

module.exports = NegotiationController;
