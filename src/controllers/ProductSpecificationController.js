//Import validation result
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const { ProductSpecification, Product } = require('~database/models');



class ProductspecController{

    static async hello(req , res){

        return res.status(200).json({
            message : "Hello Product Specification"
        });
    }

   
    /* ---------------------------- * ADD Product Specification * ---------------------------- */
    static async add(req , res){

        // return res.status(200).json({
        //     message : "Add Product Specification "
        // });

    
        const errors = validationResult(req);

        try{
            
            if(!errors.isEmpty()){
                return res.status(400).json({ errors: errors.array() });
            }
    
            
            let randomid = crypto.randomBytes(8).toString('hex');

            const { count, rows } = await Product.findAndCountAll({ where: { id: req.body.model_id  } });
            var findProductSpec = await ProductSpecification.findOne({ where: { model_id: req.body.model_id  } });
            console.log(findProductSpec, "This is findProductcount");
            if(count < 1){
                return res.status(200).json({
                    "error": true,
                    "message": "Product does not exits",
                    // "Cropdescription": Cropdescription
                })
            }else if(findProductSpec){
                return res.status(200).json({
                    "error": true,
                    "message": "Product specification already exits for this product",
                    // "Cropdescription": Cropdescription
                })
            }else{
                var Productspec = await ProductSpecification.create({
                    model_id: req.body.model_id,
                    model_type: req.body.model_type,
                    qty: req.body.qty,
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
                console.log(req.body)
                return res.status(200).json({
                    "error": false,
                    "message": "Product specification created successfully",
                    "ProductSpecification": ProductSpecification
                })

            }
        }catch(error){
            return res.status(500).json({
                "error": true,
                "message": error.toString()
            })  
        }

        
    }
    // /* ---------------------------- * ADD Product Specification * ---------------------------- */

   

}

module.exports = ProductspecController;
