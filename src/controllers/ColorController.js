const { request } = require("express");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const { Color, ErrorLog } = require("~database/models");

class ColorController{

    /* ------------------------------ GET ALL ColorS ----------------------------- */
    static async getAllColors(req,res){
        try{

            var allcolors = await Color.findAll();

            if(allcolors){
                return res.status(200).json({
                    error:false,
                    message: "colors acquired successfully",
                    data: allcolors
                });

            }else{
                return res.status(200).json({
                    error:true,
                    message: "Failed to acquire colors",
 
                });
            }
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on getting all colors",
                error_description: e.toString(),
                route: "/api/color/getall",
                error_code: "500"
            });
            if(logError){
                return res.status(500).json({
                    error: true,
                    message: 'Unable to complete request at the moment',
                })
    
            }
        }
    }



    /* ----------------- GET Color BY PARAMS (LIMIT AND OFFSET ) ---------------- */
    static async getColorbyparams(req,res){
        try{

            const limit = Number(req.params.limit);
            const offset = Number(req.params.offset);
            var colorparams = await Color.findAll({
                limit:limit,
                offset:offset
            });

            /* ---------------------------------- ACTIVITY LOG --------------------------------- */
            var adminId = await  serveAdminid.getTheId(req);

            await Activitylog.create({
                admin_id:adminId ,
                section_accessed:'Viewing colors by offset and limit',
                page_route:'/api/admin/colors/getallparams/:offset/:limit',
                action:'Viewing sets of colors in the list '
            });
            /* ---------------------------------- ACTIVITY LOG --------------------------------- */

            if(colorparams ){
                return res.status(200).json({
                    error:false,
                    message: "colors acquired successfully",
                    data: colorparams
                })
            }else{
                return res.status(200).json({
                    error:true,
                    message: "Failed to acquire colors",
                })
            }

        }catch(e){
            var logError = await ErrorLog.create({
                    error_name: "Error on getting colors by params",
                    error_description: e.toString(),
                    route: "/api/admin/color/getallparams/:offset/:limit",
                    error_code: "500"
                });
                if(logError){
                    return res.status(500).json({
                        error: true,
                        message: 'Unable to complete request at the moment',
                    });
                }
        }
    }

    /* ----------------------------- GET Color BY ID ----------------------------- */
    static async getColorbyid(req,res){
        try{
        
            var colorid = await Color.findOne({where: {id:req.params.id}});

            /* ----------------------------------  ACTIVITY LOG --------------------------------- */

            if(colorid == null){
                return res.status(200).json({
                    error:true,
                    message: 'Invalid id'
                })

            }else if(colorid){
                return res.status(200).json({
                    error:false,
                    message: "Color acquired successfully",
                    data: colorid
                })
            }else{
                return res.status(200).json({
                    error:true,
                    message: "Failed to acquire color",
                
                });
            }    

        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on getting color by id",
                error_description: e.toString(),
                route: "/api/admin/color/getbyid/:id",
                error_code: "500"
            });
            if(logError){
                return res.status(500).json({
                    error: true,
                    message: 'Unable to complete request at the moment',
                });
            } 
        }
    }


}
module.exports =ColorController;