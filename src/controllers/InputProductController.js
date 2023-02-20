const { request } = require("express");
const { Input, ErrorLog, Category, SubCategory } = require("~database/models");
const { validationResult } = require("express-validator");
const crypto = require("crypto");
const md5 = require("md5");
var appRoot = require("app-root-path");

// const jwt = require("jsonwebtoken");

<<<<<<< HEAD
class InputProducts{

    static async createInput(req , res){

        let sampleFile;
        let uploadPath;

        const errors = validationResult(req);

        let randomid = crypto.randomBytes(8).toString('hex');
        
        try{

            if(!errors.isEmpty()){
                return res.status(400).json({
                    "error": true,
                    "message": "All fields are required",
                    "data": []
                }) 
            }
            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).json({
                    "error": true,
                    "message": "No input images(s) found.",
                    "data": []
                })
            
            }else{
                
                
                let allImages = Object.keys(req.files);

                /* -------------------------- MOVE UPLOADED FOLDER -------------------------- */
                let my_object = [];
                for(let i = 0; i < allImages.length; i++ ){
                    
                    my_object.push(req.files[allImages[i]].name);
                    sampleFile = req.files[allImages[i]];
                    uploadPath = __dirname + "/uploads/" + req.files[allImages[i]].name;

                    sampleFile.mv(uploadPath, function(err) {
                    });
                }
                /* -------------------------- MOVE UPLOADED FOLDER -------------------------- */

                /* ------------------------ INSERT INTO PRODUCT TABLE ----------------------- */
                var input = await Input.create({
                    user_id: req.global.user.id,
                    category_id: req.body.category_id,
                    subcategory_id: req.body.subcategory_id,
                    product_type: req.body.product_type,
                    crop_focus: req.body.crop_focus,
                    packaging: req.body.packaging,
                    description: req.body.description,
                    stock: req.body.stock,
                    usage_instruction: req.body.usage_instruction,
                    stock: req.body.stock,
                    kilograms: req.body.kilograms,
                    grams: req.body.grams,
                    liters: req.body.liters,
                    images: my_object.toString(),
                    price: req.body.price,
                    currency: req.body.currency,
                    manufacture_name: req.body.manufacture_name,
                    manufacture_date: req.body.manufacture_date,
                    delivery_method: req.body.delivery_method,
                    expiry_date: req.body.expiry_date,
                    manufacture_country: req.body.manufacture_country,
                    state: req.body.state,
                    video: req.body.video,
                    active: 1
                })
                
                /* ------------------------ INSERT INTO PRODUCT TABLE ----------------------- */


                if(input){

                    return res.status(200).json({
                        "error": false,
                        "message": "Input created successfully",
                        data: []
                    })

                }
  
            
            }

        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on adding an input",
                error_description: e.toString(),
                route: "/api/input/product/add",
                error_code: "500"
            });
            if(logError){
                return res.status(500).json({
                    error: true,
                    // message: 'Unable to complete request at the moment'+req.body.state+' '+e.toString()
                    message: 'Unable to complete request at the moment'
                })
            }  
        }

        
    }

    static async getAllInputsByUser(req, res) {
        try {
            var alluserinputs = await Input.findAll({
                include: [
                    {
                        model: Category,
                        as: "category"
                    },
                    {
                        model: SubCategory,
                        as: "subcategory"
                    }
                ],
                where: {
                    user_id: req.params.user_id,
                    active: 1
                }
            });

            if(alluserinputs.length > 0){

                return res.status(200).json({
                    error : false,
                    message: "All Inputs returned successfully",
                    data : alluserinputs
                })

            }else{

                return res.status(200).json({
                    error : false,
                    message: "User does not have an input product",
                    data : []
                })

            }
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on getting all user Inputs",
                error_description: e.toString(),
                route: "/api/input/getallbyuserid/:user_id",
                error_code: "500"
            });
            if(logError){
                return res.status(500).json({
                    error: true,
                    message: 'Unable to complete request at the moment'+e.toString()
                })
            }  
=======
class InputProducts {
  static async createInput(req, res) {
    let sampleFile;
    let uploadPath;

    const errors = validationResult(req);

    let randomid = crypto.randomBytes(8).toString("hex");

    try {
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: true,
          message: "All fields are required",
          data: [],
        });
      }
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
          error: true,
          message: "No input images(s) found.",
          data: [],
        });
      } else {
        let allImages = Object.keys(req.files);

        /* -------------------------- MOVE UPLOADED FOLDER -------------------------- */
        let my_object = [];
        for (let i = 0; i < allImages.length; i++) {
          var file = req.files[allImages[i]];
          var extension = file.mimetype.split("/")[1];
          var newName =
            md5(file.name + new Date().toDateString()) + `.${extension}`;
          var imagePath = `/data/products/${newName}`;
          my_object.push(imagePath);
          sampleFile = file;
          uploadPath = `${appRoot}/public${imagePath}`;
          sampleFile.mv(uploadPath, function (err) {
            if (err) {
              return res.status(500).send(err + " Error in uploading file");
            } else {
              // res.send('File uploaded!');
              // image = "image"+i;
              // my_object.image = "uploadPath"
            }
          });
        }
        /* -------------------------- MOVE UPLOADED FOLDER -------------------------- */

        /* ------------------------ INSERT INTO PRODUCT TABLE ----------------------- */
        var input = await Input.create({
          user_id: req.global.user.id,
          category_id: req.body.category_id,
          subcategory_id: req.body.subcategory_id,
          product_type: req.body.product_type,
          crop_focus: req.body.crop_focus,
          packaging: req.body.packaging,
          description: req.body.description,
          stock: req.body.stock,
          usage_instruction: req.body.usage_instruction,
          stock: req.body.stock,
          kilograms: req.body.kilograms,
          grams: req.body.grams,
          liters: req.body.liters,
          images: JSON.stringify(my_object),
          price: req.body.price,
          currency: req.body.currency,
          manufacture_name: req.body.manufacture_name,
          manufacture_date: req.body.manufacture_date,
          delivery_method: req.body.delivery_method,
          expiry_date: req.body.expiry_date,
          manufacture_country: req.body.manufacture_country,
          state: req.body.state,
          video: req.body.video,
          active: 1,
        });

        /* ------------------------ INSERT INTO PRODUCT TABLE ----------------------- */

        if (input) {
          return res.status(200).json({
            error: false,
            message: "Input created successfully",
            data: [],
          });
>>>>>>> cd560e8e68c941b21ceca33ab74effd435b50d81
        }
      }
    } catch (e) {
      var logError = await ErrorLog.create({
        error_name: "Error on adding an input",
        error_description: e.toString(),
        route: "/api/input/product/add",
        error_code: "500",
      });
      if (logError) {
        return res.status(500).json({
          error: true,
          message: "Unable to complete request at the moment" + e,
        });
      }
    }
<<<<<<< HEAD

    static async getallInputs(req , res){
        try{
            var alluserinputs = await Input.findAll();

            if(alluserinputs.length > 0){

                return res.status(200).json({
                    error : false,
                    message: "All Inputs returned successfully",
                    data : alluserinputs
                })

            }else{

                return res.status(200).json({
                    error : false,
                    message: "No input products found",
                    data : []
                })

            }
        }catch(e){
            var logError = await ErrorLog.create({
                error_name: "Error on getting all Inputs",
                error_description: e.toString(),
                route: "/api/input/getall",
                error_code: "500"
            });
            if(logError){
                return res.status(500).json({
                    error: true,
                    // message: 'Unable to complete request at the moment'+e.toString()
                    message: 'Unable to complete request at the moment'
                })
            }  
        }
=======
  }

  static async getAllInputsByUser(req, res) {
    try {
      var alluserinputs = await Input.findAll({
        include: [
          {
            model: Category,
            as: "category",
          },
          {
            model: SubCategory,
            as: "subcategory",
          },
        ],
        where: {
          user_id: req.global.user.id,
          active: 1,
        },
        order: [["id", "DESC"]],
      });

      if (alluserinputs.length > 0) {
        return res.status(200).json({
          error: false,
          message: "All Inputs returned successfully",
          data: alluserinputs,
        });
      } else {
        return res.status(200).json({
          error: false,
          message: "User does not have an input product",
          data: [],
        });
      }
    } catch (e) {
      var logError = await ErrorLog.create({
        error_name: "Error on getting all user Inputs",
        error_description: e.toString(),
        route: "/api/input/getallbyuserid/:user_id",
        error_code: "500",
      });
      if (logError) {
        return res.status(500).json({
          error: true,
          message: "Unable to complete request at the moment",
        });
      }
>>>>>>> cd560e8e68c941b21ceca33ab74effd435b50d81
    }
  }

  static async getallInputs(req, res) {
    try {
      var alluserinputs = await Input.findAll({
        include: [
          { model: Category, as: "category" },
          { model: SubCategory, as: "subcategory" },
        ],
      });

      if (alluserinputs.length > 0) {
        return res.status(200).json({
          error: false,
          message: "All Inputs returned successfully",
          data: alluserinputs,
        });
      } else {
        return res.status(200).json({
          error: false,
          message: "No input products found",
          data: [],
        });
      }
    } catch (e) {
      var logError = await ErrorLog.create({
        error_name: "Error on getting all Inputs",
        error_description: e.toString(),
        route: "/api/input/getall",
        error_code: "500",
      });
      if (logError) {
        return res.status(500).json({
          error: true,
          message: "Unable to complete request at the moment",
        });
      }
    }
  }

  static async getInputById(req, res) {
    try {
      var input = await Input.findOne({
        include: [
          { model: Category, as: "category" },
          { model: SubCategory, as: "subcategory" },
        ],
        where: { id: req.params.input },
      });

      if (input) {
        return res.status(200).json({
          error: false,
          message: "Input returned successfully",
          data: input,
        });
      } else {
        return res.status(200).json({
          error: false,
          message: "No such input found",
          data: [],
        });
      }
    } catch (e) {
      var logError = await ErrorLog.create({
        error_name: "Error on getting input",
        error_description: e.toString(),
        route: "/api/input/:input",
        error_code: "500",
      });
      if (logError) {
        return res.status(500).json({
          error: true,
          message: "Unable to complete request at the moment",
        });
      }
    }
  }

  static async getallInputsByCategory(req, res) {
    try {
      var allInputs = await Input.findAll({
        where: {
          category: req.params.category,
        },
      });

      if (allInputs.length > 0) {
        return res.status(200).json({
          error: false,
          message: "All Inputs for this input type returned",
          data: allInputs,
        });
      } else {
        return res.status(200).json({
          error: false,
          message: "No input products found for this input type",
          data: [],
        });
      }
    } catch (e) {
      var logError = await ErrorLog.create({
        error_name: "Error on getting all Inputs by category",
        error_description: e.toString(),
        route: "/api/input/getallbycategory/:category",
        error_code: "500",
      });
      if (logError) {
        return res.status(500).json({
          error: true,
          message: "Unable to complete request at the moment",
        });
      }
    }
  }
  static async getallInputsByManufacturer(req, res) {
    try {
      var allInputs = await Input.findAll({
        where: {
          manufacture_name: req.params.manufacturer,
        },
      });

      if (allInputs.length > 0) {
        return res.status(200).json({
          error: false,
          message: "All Inputs for this manufacturer returned",
          data: allInputs,
        });
      } else {
        return res.status(200).json({
          error: false,
          message: "No input products found for this manufacturer",
          data: [],
        });
      }
    } catch (e) {
      var logError = await ErrorLog.create({
        error_name: "Error on getting all Inputs by manfacturer",
        error_description: e.toString(),
        route: "/api/input/getallbymanfacturer/:manfacturer",
        error_code: "500",
      });
      if (logError) {
        return res.status(500).json({
          error: true,
          message: "Unable to complete request at the moment",
        });
      }
    }
  }
  static async getallInputsByPackaging(req, res) {
    try {
      var allInputs = await Input.findAll({
        where: {
          packaging: req.params.packaging,
        },
      });

      if (allInputs.length > 0) {
        return res.status(200).json({
          error: false,
          message: "All Inputs for this packaging returned",
          data: allInputs,
        });
      } else {
        return res.status(200).json({
          error: false,
          message: "No input products found for this packaging",
          data: [],
        });
      }
    } catch (e) {
      var logError = await ErrorLog.create({
        error_name: "Error on getting all Inputs by packaging",
        error_description: e.toString(),
        route: "/api/input/getallbypackaging/:packaging",
        error_code: "500",
      });
      if (logError) {
        return res.status(500).json({
          error: true,
          message: "Unable to complete request at the moment",
        });
      }
    }
  }

  /* ---------------------------- Delete crop by id --------------------------- */

  static async deleteCropById(req, res) {
    const errors = validationResult(req);

    try {
      /* ------------------------ UPDATE INTO CROP TABLE ----------------------- */

      var crop = await Crop.findOne({ where: { id: req.params.id } });
      if (crop) {
        var type = crop.type;

        if (type == "wanted") {
          await CropRequest.destroy({
            where: {
              crop_id: req.params.id,
            },
          });
        }

        if (type == "auction") {
          await Auction.destroy({
            where: {
              crop_id: req.params.id,
            },
          });
        }

        crop.destroy();

        await CropSpecification.destroy({
          where: {
            model_type: "crop",
            model_id: req.params.id,
          },
        });

        return res.status(200).json({
          error: false,
          message: "Crop deleted successfully",
        });
      } else {
        return res.status(400).json({
          error: true,
          message: "No such crop found",
          data: req.body,
        });
      }
    } catch (e) {
      var logError = await ErrorLog.create({
        error_name: "Error on edit a crop",
        error_description: e.toString(),
        route: "/api/crop/delete",
        error_code: "500",
      });
      if (logError) {
        return res.status(500).json({
          error: true,
          message: "Unable to complete request at the moment",
        });
      }
    }
  }

  /* ---------------------------- Delete input by id --------------------------- */

  static async deleteInputById(req, res) {
    const errors = validationResult(req);

    try {
      /* ------------------------ UPDATE INTO CROP TABLE ----------------------- */

      var input = await Input.findOne({ where: { id: req.params.id } });
      if (input) {
        input.destroy();

        return res.status(200).json({
          error: false,
          message: "Input deleted successfully",
        });
      } else {
        return res.status(400).json({
          error: true,
          message: "No such input found",
          data: req.body,
        });
      }
    } catch (e) {
      var logError = await ErrorLog.create({
        error_name: "Error on edit a crop",
        error_description: e.toString(),
        route: "/api/crop/delete",
        error_code: "500",
      });
      if (logError) {
        return res.status(500).json({
          error: true,
          message: "Unable to complete request at the moment",
        });
      }
    }
  }

  static async deactivateInputById(req, res) {
    const errors = validationResult(req);

    try {
      /* ------------------------ UPDATE INTO CROP TABLE ----------------------- */

      var input = await Input.findOne({ where: { id: req.params.id } });
      if (input) {
        input.active = 0;
        input.save();

        return res.status(200).json({
          error: false,
          message: "Input deactivated successfully",
        });
      } else {
        return res.status(400).json({
          error: true,
          message: "No such input found",
          data: req.body,
        });
      }
    } catch (e) {
      var logError = await ErrorLog.create({
        error_name: "Error on edit a crop",
        error_description: e.toString(),
        route: "/api/crop/delete",
        error_code: "500",
      });
      if (logError) {
        return res.status(500).json({
          error: true,
          message: "Unable to complete request at the moment",
        });
      }
    }
  }
}

module.exports = InputProducts;
