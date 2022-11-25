        
const jwt = require("jsonwebtoken");
const { ProductSpecification} = require("~models");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const Mailer = require('~services/mailer');
const { buyers } = require("~database/models");
const md5  = require('md5');
const { reset } = require("nodemon");
const { use } = require("~routes/api");



class ProductSpecificationController{

    static async specification(req, res){
        const errors = validationResult(req);
        console.log(errors.array());
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        const data = req.body;
        console.log(data);

        let objModel = await ProductSpecificationController.saveProduct(data);
        console.log(objModel);
        if(!objModel){
            return res.status(400).json({
             error : true,
             message : "Invalid request"
            });
         }else{
            return res.status(200).json({
                error : false,
                message : "Product Registered"
            })
         }
    }

   
    static async saveProduct(data){
        let product = ProductSpecification();

        product.category = data.category;
        product.sub_category = data.sub_category;
        product.color = data.color;
        product.moisture = data.moisture;
        product.foreign_matter = data.matter;
        product.broken_grains = data.broken_grains;
        product.weeevil = data.weeevil;
        product.dk = data.dk;
        product.rotten_shriveled = data.rotten_shriveled;
        product.test_weight = data.weight;
        product.hectolitter = data.hectolitter;
        product.hardness = data.hardness;
        product.splits = data.splits;
        product.oil_content = data.oil_content;
        product.infestation = data.infestation;
        product.grian_size = data.grian_size;
        product.total_defects = data.total_defects;
        product.dockage = data.dockage;
        product.ash_content = data.ash_content;
        product.acid_ash = data.acid_ash;
        product.volatile = data.volatile;
        product.mold = data.mold;
        product.drying_process = data.drying_process;
        product.dead_insect = data.dead_insect;
        product.mammalian = data.mammalian;
        product.infested_by_weight = data.infested_by_weight;
        product.curcumin_content = data.curcumin_content;
        product.extraneous = data.extraneous;
        product.kg = data.kg;
        product.liters = data.liters;
        
        
        try{  
            await product.save();
        }catch(e){
            product = {
                error : true,
                message : e.sqlMessage
            }
        }

        return product;
    }
}

module.exports = ProductSpecificationController;