//Import validation result
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const { Product, ProductSpecification, ProductRequest, ErrorLog } = require('~database/models');
// const { uploads } = require('~cropimageupload');



class ProductController{

    static async hello(req , res){

        return res.status(200).json({
            message : "Hello Product"
        });
    }

   
    /* ---------------------------- * ADD Cropdescription * ---------------------------- */
    static async add(req , res){

        // return res.status(200).json({
        //     message : "Add Cropdescription "
        // });

        let sampleFile;
        let uploadPath;

        const errors = validationResult(req);

        let randomid = crypto.randomBytes(8).toString('hex');
        // let allImages = Object.keys(req.files);
        // console.log(__dirname + '/uploads/' + req.files[allImages[0]].name);
        try{

            if(!errors.isEmpty()){
                // return res.status(400).json({ errors: errors.array() });
                return res.status(200).json({
                    "error": true,
                    "message": "All fields are required",
                    "data": errors
                }) 
            }

            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(200).json({
                    "error": true,
                    "message": "No files were uploaded."
                }) 
            
            }else{
                // console.log(req.files);

                // console.log('req.files >>>', req.files); // eslint-disable-line
                
                
                let allImages = Object.keys(req.files);
                
                // let theurlpath = Object.keys("http://localhost:3000/"+req.files);
                // console.log(allImages, "THE IMAGES HIUGUFTYDFGHJKHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH");

                /* -------------------------- MOVE UPLOADED FOLDER -------------------------- */
                let my_object = [];
                for(let i = 0; i < allImages.length; i++ ){
                    
                    my_object.push(req.files[allImages[i]].name);
                    sampleFile = req.files[allImages[i]];
                    uploadPath = __dirname + '/uploads/' + req.files[allImages[i]].name;

                    sampleFile.mv(uploadPath, function(err) {
                        if (err){
                            return res.status(500).send(err);
                        }else{
                            
                            // res.send('File uploaded!');

                            // image = "image"+i;
                            // my_object.image = "uploadPath"
                        }
                    });
                }
                // res.send(my_object);

                /* -------------------------- MOVE UPLOADED FOLDER -------------------------- */



                /* ------------------------ INSERT INTO PRODUCT TABLE ----------------------- */
               
                var product = await Product.create({
                    user_id: req.body.user_id,
                    type: req.body.type,
                    category: req.body.category,
                    sub_category: req.body.sub_category,
                    active: 0,
                    market: "cropmarket",
                    description: req.body.description,
                    images: my_object.toString(),
                    currency: req.body.currency,
                    is_negotiable: req.body.is_negotiable,
                    video: req.body.video,
                    packaging: req.body.packaging,
                    application: req.body.application,
                    manufacture_name: req.body.manufacture_name,
                    manufacture_date: req.body.manufacture_date,
                    expiration_date: req.body.expiration_date
                })
                
                /* ------------------------ INSERT INTO PRODUCT TABLE ----------------------- */


                if(product){

                    var Productspec = await ProductSpecification.create({
                        model_id: product.id,
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




                    if(Productspec){
                        var ProdRequest = await ProductRequest.create({
                            product_id: product.id,
                            state: req.body.state,
                            zip: req.body.zip,
                            country: req.body.country,
                            address: req.body.address,
                            delivery_method: req.body.delivery_method,
                            delivery_date: req.body.delivery_date,
                            delivery_window: req.body.delivery_window
                        })

                        return res.status(200).json({
                            "error": false,
                            "message": "Product created successfully",
                            // "product": product, Productspec, ProdRequest
                        })
                    }

                }
  
            
            }

        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on add a product",
                error_description: e.toString(),
                route: "/api/crop/product/add",
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
    // /* ---------------------------- * ADD Cropdescription * ---------------------------- */









    /* --------------------------- GET ALL WANTED PRODUCTS --------------------------- */
    static async getbyproductwanted(req , res){

        // return res.status(200).json({
        //     message : "GET Category By Category ID"
        // });

        const errors = validationResult(req);

        try{
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
    
            var findwantedProducts = await Product.findAll({ 
                include: [{
                    model: ProductSpecification,
                    as: 'product_specification',
                    order: [['id', 'DESC']],
                    limit: 1,
                },
                {
                    model: ProductRequest,
                    as: 'product_request',
                    order: [['id', 'DESC']],
                    limit: 1,
                    
                }],
                
                where: { type: "wanted" },
                order: [['id', 'DESC']]
            });

        
            /* --------------------- If fetched the Wanted Products --------------------- */
            
            return res.status(200).json({
                error : false,
                message : "Products wanted grabbed successfully",
                products : findwantedProducts
            })
            
        }catch(error){
            var logError = await ErrorLog.create({
                error_name: "Error on fetching product wanted",
                error_description: e.toString(),
                route: "/api/crop/product/getbyproductwanted",
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
    /* --------------------------- GET ALL WANTED PRODUCTS --------------------------- */









    /* --------------------------- GET ALL OFFERED PRODUCTS --------------------------- */
    static async getbyproductoffer(req , res){

        // return res.status(200).json({
        //     message : "GET Category By Category ID"
        // });

        const errors = validationResult(req);

        try{
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
    
            var findofferProducts = await Product.findAll({ 
                include: [{
                    model: ProductSpecification,
                    as: 'product_specification',
                    order: [['id', 'DESC']],
                    limit: 1,
                },
                {
                    model: ProductRequest,
                    as: 'product_request',
                    order: [['id', 'DESC']],
                    limit: 1,
                    
                }],
                
                where: { type: "offer" },
                order: [['id', 'DESC']]
            });

        
            /* --------------------- If fetched the Wanted Products --------------------- */
            
            return res.status(200).json({
                error : false,
                message : "Products offer grabbed successfully",
                products : findwantedProducts
            })
            
        }catch(error){
            var logError = await ErrorLog.create({
                error_name: "Error on fetching product offer",
                error_description: e.toString(),
                route: "/api/crop/product/getbyproductoffer",
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
    /* --------------------------- GET ALL OFFERED PRODUCTS --------------------------- */





    /* --------------------------- GET PRODUCT BY ID --------------------------- */
    static async getbyid(req , res){

        // return res.status(200).json({
        //     message : "GET Product by ID"
        // });

        const errors = validationResult(req);

        try{
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
    
            var product = await Product.findOne({ where: { id: req.body.id } });
            if(product){

                var findProduct = await Product.findOne({ 
                    include: [{
                        model: ProductSpecification,
                        as: 'product_specification',
                        order: [['id', 'DESC']],
                        limit: 1,
                    },
                    {
                        model: ProductRequest,
                        as: 'product_request',
                        order: [['id', 'DESC']],
                        limit: 1,
                        
                    }],
                    
                    where: { id: req.body.id },
                    order: [['id', 'DESC']]
                });
    
                return res.status(200).json({
                    error : false,
                    message : "Single product grabbed successfully",
                    data : findProduct
                })
            }else{
                return res.status(400).json({
                    error : true,
                    message : "No such product found",
                    data : req.body
                })
            }
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on getting single product by id",
                error_description: e.toString(),
                route: "/api/crop/product/getbyid",
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
    /* --------------------------- GET PRODUCT BY ID --------------------------- */









    /* ---------------------------- * EDIT Project by ID * ---------------------------- */
    static async editbyid(req , res){

        // return res.status(200).json({
        //     message : "Add Cropdescription "
        // });

        let sampleFile;
        let uploadPath;

        const errors = validationResult(req);

        let randomid = crypto.randomBytes(8).toString('hex');
        // let allImages = Object.keys(req.files);
        // console.log(__dirname + '/uploads/' + req.files[allImages[0]].name);
        try{

            if(!errors.isEmpty()){
                // return res.status(400).json({ errors: errors.array() });
                return res.status(200).json({
                    "error": true,
                    "message": "All fields are required",
                    "data": errors
                }) 
            }

            



            /* ------------------------ UPDATE INTO PRODUCT TABLE ----------------------- */

            var product = await Product.findOne({ where: { id: req.body.product_id } });
            if(product){
            
                var product = await Product.update({
                    user_id: req.body.user_id,
                    type: req.body.type,
                    category: req.body.category,
                    sub_category: req.body.sub_category,
                    active: 0,
                    market: "cropmarket",
                    description: req.body.description,
                    // images: my_object.toString(),
                    currency: req.body.currency,
                    is_negotiable: req.body.is_negotiable,
                    video: req.body.video,
                    packaging: req.body.packaging,
                    application: req.body.application,
                    manufacture_name: req.body.manufacture_name,
                    manufacture_date: req.body.manufacture_date,
                    expiration_date: req.body.expiration_date
                }, { where : { id: req.body.product_id } });
                
                /* ------------------------ UPDATE INTO PRODUCT TABLE ----------------------- */


                if(product){

                    var Productspec = await ProductSpecification.update({
                        model_id: product.id,
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
                    }, { where : { model_id: req.body.product_id  } });




                    if(Productspec){
                        var ProdRequest = await ProductRequest.update({
                            product_id: product.id,
                            state: req.body.state,
                            zip: req.body.zip,
                            country: req.body.country,
                            address: req.body.address,
                            delivery_method: req.body.delivery_method,
                            delivery_date: req.body.delivery_date,
                            delivery_window: req.body.delivery_window
                        }, { where : { product_id: req.body.product_id,  } });

                        return res.status(200).json({
                            "error": false,
                            "message": "Product edited successfully",
                            // "product": product, Productspec, ProdRequest
                        })
                    }

                }

            }else{
                return res.status(400).json({
                    error : true,
                    message : "No such product found",
                    data : req.body
                })
            }
  
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on edit a product",
                error_description: e.toString(),
                route: "/api/crop/product/editbyid",
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
    // /* ---------------------------- * EDIT Project by ID * ---------------------------- */



   

}

module.exports = ProductController;
