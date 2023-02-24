//Import validation result
const { validationResult } = require("express-validator");
const crypto = require("crypto");
const {
    Crop,
    CropSpecification,
    CropRequest,
    ErrorLog,
    User,
    Category,
    Auction,
    SubCategory,
    Bid,
} = require("~database/models");
const md5 = require("md5");
var appRoot = require("app-root-path");

class CropController {
    static async hello(req, res) {
        return res.status(200).json({
            message: "Hello Crop",
        });
    }

    /* ---------------------------- * ADD Cropdescription * ---------------------------- */
    static async add(req, res) {
        let sampleFile;
        let uploadPath;

        const errors = validationResult(req);

        let randomid = crypto.randomBytes(8).toString("hex");

        try {
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: true,
                    message: "All fields are required",
                    data: errors,
                });
            }
            var type = req.params.type;

            if (type != "wanted" && type != "sale" && type != "auction") {
                return res.status(400).json({
                    error: true,
                    message: "Invalid type",
                    data: errors,
                });
            }

            if (type == "sale") {
                type = "offer";
            }

            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).json({
                    error: true,
                    message: "No files were uploaded.",
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
                        }
                    });
                }

                /* -------------------------- MOVE UPLOADED FOLDER -------------------------- */

                /* ------------------------ INSERT INTO CROP TABLE ----------------------- */

                var crop = await Crop.create({
                    user_id: req.global.user.id,
                    type: type,
                    category_id: req.body.category_id,
                    subcategory_id: req.body.subcategory_id,
                    active: 1,
                    market: "crop",
                    description: req.body.description,
                    images: JSON.stringify(my_object),
                    currency: req.body.currency,
                    is_negotiable: req.body.is_negotiable,
                    video: req.body.video,
                    packaging: "",
                    application: "",
                    warehouse_address: req.body.warehouse_address,
                });

                /* ------------------------ INSERT INTO CROP TABLE ----------------------- */

                if (crop) {
                    var createCropSpecification = await CropSpecification.create({
                        model_id: crop.id,
                        model_type: "crop",
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
                    });

                    if (createCropSpecification) {
                        if (type == "wanted") {
                            var createCroropRequest = await CropRequest.create({
                                crop_id: crop.id,
                                state: req.body.state,
                                zip: req.body.zip,
                                country: req.body.country,
                                address: req.body.warehouse_address,
                                delivery_window: req.body.delivery_window,
                            });
                        }

                        if (type == "auction") {
                            var createAuction = await Auction.create({
                                crop_id: crop.id,
                                start_date: req.body.start_date,
                                end_date: req.body.end_date,
                                minimum_bid: req.body.minimum_bid,
                                status: 1,
                            });
                        }

                        return res.status(200).json({
                            error: false,
                            message: "Crop created successfully",
                            // "product": product, Cropspec, ProdRequest
                        });
                    }
                }
            }
        } catch (e) {
            var logError = await ErrorLog.create({
                error_name: "Error on add a crop",
                error_description: e.toString(),
                route: "/api/crop/add",
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
    // /* ---------------------------- * ADD Cropdescription * ---------------------------- */

    /* --------------------------- GET ALL WANTED CROPS --------------------------- */
    static async getByCropWanted(req, res) {
        // return res.status(200).json({
        //     message : "GET Wanted Crops"
        // });

        const errors = validationResult(req);

        try {
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            var findWantedCrops = await Crop.findAndCountAll({
                include: [
                    {
                        model: CropSpecification,
                        as: "specification",
                    },
                    {
                        model: CropRequest,
                        as: "crop_request",
                    },
                    {
                        model: Category,
                        as: "category",
                    },
                    {
                        model: SubCategory,
                        as: "subcategory",
                    },
                    {
                        model: User,
                        as: "user",
                    },
                ],
                where: { type: "wanted", active: 1 },
                order: [['id', 'DESC']],
            });

            /* --------------------- If fetched the Wanted Crops --------------------- */

            return res.status(200).json({
                error: false,
                message: "Crops wanted grabbed successfully",
                data: findWantedCrops,
            });
        } catch (e) {
            var logError = await ErrorLog.create({
                error_name: "Error on fetching crop wanted",
                error_description: e.toString(),
                route: "/api/crop/getbycropwanted",
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
    /* --------------------------- GET ALL WANTED CROPS --------------------------- */

    /* --------------------------- GET ALL AUCTION CROPS --------------------------- */
    static async getByCropAuctions(req, res) {
        try {
            var findCropAuctions = await Crop.findAndCountAll({
                include: [
                    {
                        model: CropSpecification,
                        as: "specification",
                    },
                    {
                        model: Category,
                        as: "category",
                    },
                    {
                        model: SubCategory,
                        as: "subcategory",
                    },
                    {
                        model: User,
                        as: "user",
                    },
                    {
                        model: Auction,
                        as: "auction",
                    },
                ],

                where: { type: "auction", active: 1 },
                order: [['id', 'DESC']],
            });

            /* --------------------- If fetched the Wanted Crops --------------------- */

            return res.status(200).json({
                error: false,
                message: "Crops auctions grabbed successfully",
                data: findCropAuctions,
            });
        } catch (error) {
            var logError = await ErrorLog.create({
                error_name: "Error on fetching crop wanted",
                error_description: error.toString(),
                route: "/api/crop/getbycropauction",
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
    /* --------------------------- GET ALL WANTED CROPS --------------------------- */

    /* --------------------------- GET ALL OFFERED CROPS --------------------------- */
    static async getByCropOffer(req, res) {
        try {
            const { count, rows } = await Crop.findAndCountAll({
                where: { type: "offer" },
            });

            if (count < 1) {
                return res.status(200).json({
                    error: true,
                    message: "No crop offer found",
                    data: [],
                });
            } else {
                var findCropOffers = await Crop.findAndCountAll({
                    include: [
                        {
                            model: CropSpecification,
                            as: "specification",
                            where: { model_type: "crop" },
                        },
                        {
                            model: Category,
                            as: "category",
                        },
                        {
                            model: SubCategory,
                            as: "subcategory",
                        },
                        {
                            model: User,
                            as: "user",
                        },
                    ],
                    where: { type: "offer", active: 1 },
                    order: [['id', 'DESC']],
                });

                /* --------------------- If fetched the Wanted Crops --------------------- */

                return res.status(200).json({
                    error: false,
                    message: "Crops offer grabbed successfully",
                    data: findCropOffers,
                });
            }
        } catch (e) {
            var logError = await ErrorLog.create({
                error_name: "Error on fetching crops offer",
                error_description: e.toString(),
                route: "/api/crop/getbycropoffer",
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
    /* --------------------------- GET ALL OFFERED CROPS --------------------------- */

    /* --------------------------- GET ALL AUCTION CROPS --------------------------- */
    static async getAllCropsByUser(req, res) {
        try {
            var findCrops = await Crop.findAndCountAll({
                include: [
                    {
                        model: CropSpecification,
                        as: "specification",
                    },
                    {
                        model: Category,
                        as: "category",
                    },
                    {
                        model: SubCategory,
                        as: "subcategory",
                    },
                    {
                        model: Auction,
                        as: "auction",
                    },
                    {
                        model: CropRequest,
                        as: "crop_request",
                    },
                ],

                where: { user_id: req.global.user.id, active: 1 },
                order: [['id', 'DESC']],
            });

            /* --------------------- If fetched the Wanted Crops --------------------- */

            return res.status(200).json({
                error: false,
                message: "Crops grabbed successfully",
                data: findCrops,
            });
        } catch (error) {
            var logError = await ErrorLog.create({
                error_name: "Error on fetching crop wanted",
                error_description: error.toString(),
                route: "/api/user/crops",
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
    /* --------------------------- GET ALL WANTED CROPS --------------------------- */

    /* --------------------------- GET CROP BY ID --------------------------- */
    static async getById(req, res) {
        try {
            const cropId = req.params.id;

            var crop = await Crop.findOne({ where: { id: cropId } });
            if (crop) {
                var findCrop = await Crop.findOne({
                    include: [
                        {
                            model: CropSpecification,
                            as: "specification",
                        },
                        {
                            model: Category,
                            as: "category",
                        },
                        {
                            model: SubCategory,
                            as: "subcategory",
                        },
                        {
                            model: CropRequest,
                            as: "crop_request",
                        },
                        {
                            model: User,
                            as: "user",
                        },
                        {
                            model: Auction,
                            as: "auction",
                        },
                    ],

                    where: { id: cropId },
                    order: [["id", "DESC"]],
                });

                return res.status(200).json({
                    error: false,
                    message: "Single crop grabbed successfully",
                    data: findCrop,
                });
            } else {
                return res.status(400).json({
                    error: true,
                    message: "No such crop found",
                    data: [],
                });
            }
        } catch (e) {
            var logError = await ErrorLog.create({
                error_name: "Error on getting single crop by id",
                error_description: e.toString(),
                route: "/api/crop/getbyid",
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
    /* --------------------------- GET CROP BY ID --------------------------- */

    static async getCropBids(req, res) {
        try {
            /* ------------------------ UPDATE INTO CROP TABLE ----------------------- */

            var bids = await Bid.findAll({
                where: { crop_id: req.params.id },
                order: [["id", "DESC"]],
            });
            if (bids) {
                return res.status(200).json({
                    error: false,
                    message: "Bids returned successfully",
                    data: bids,
                });
            } else {
                return res.status(200).json({
                    error: false,
                    message: "No bids on this crop",
                    data: [],
                });
            }
        } catch (e) {
            var logError = await ErrorLog.create({
                error_name: "Error on edit a crop",
                error_description: e.toString(),
                route: "/api/crop/:id/bid",
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

    static async bidForCrop(req, res) {
        const errors = validationResult(req);

        try {
            if (!errors.isEmpty()) {
                // return res.status(400).json({ errors: errors.array() });
                return res.status(200).json({
                    error: true,
                    message: "All fields are required",
                    data: errors,
                });
            }

            /* ------------------------ UPDATE INTO CROP TABLE ----------------------- */

            var crop = await Crop.findOne({ where: { id: req.params.id } });
            if (crop) {
                //Check for existing bid
                var existingBids = await Bid.findAll({
                    where: { crop_id: req.params.id },
                });

                if (existingBids.length == 0) {
                    var bid = await Bid.create({
                        user_id: req.global.user.id,
                        crop_id: req.params.id,
                        amount: req.body.amount,
                    });

                    return res.status(200).json({
                        error: false,
                        message: "Bid created",
                    });
                } else {
                    var maxBid = 0;
                    existingBids.forEach((bid) => {
                        maxBid = bid.amount > maxBid ? bid.amount : maxBid;
                    });
                    if (eval(req.body.amount) <= eval(maxBid)) {
                        return res.status(400).json({
                            error: true,
                            message: "Bid must be higher than previous bid",
                        });
                    } else {
                        var bid = await Bid.create({
                            user_id: req.global.user.id,
                            crop_id: req.params.id,
                            amount: req.body.amount,
                        });

                        return res.status(200).json({
                            error: false,
                            message: "Bid created",
                        });
                    }
                }
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
                route: "/api/crop/:id/bid",
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
    /* --------------------------- GET ALL CROPS TYPE BY USERID --------------------------- */
    static async getByTypeandUserID(req, res) {
        try {
            var findCrops = await Crop.findAndCountAll({
                include: [
                    {
                        model: CropSpecification,
                        as: "specification",
                    },
                    {
                        model: Category,
                        as: "category",
                    },
                    {
                        model: Auction,
                        as: "auction",
                    },
                ],

                where: { type: req.params.type, user_id: req.global.user.id },

                order: [['id', 'DESC']],

            });

            /* --------------------- If fetched the Wanted Crops --------------------- */

            return res.status(200).json({
                error: false,
                message: "Crops grabbed successfully",
                data: findCrops,
            });
        } catch (error) {
            var logError = await ErrorLog.create({
                error_name: "Error on fetching crop wanted",
                error_description: error.toString(),
                route: "/api/user/crops",
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
    /* --------------------------- GET ALL CROPS TYPE BY USERID --------------------------- */

    /* ---------------------------- * EDIT Project by ID * ---------------------------- */
    static async EditById(req, res) {
        // return res.status(200).json({
        //     message : "Add Cropdescription "
        // });

        let sampleFile;
        let uploadPath;

        const errors = validationResult(req);

        let randomid = crypto.randomBytes(8).toString("hex");
        // let allImages = Object.keys(req.files);
        // console.log(__dirname + '/uploads/' + req.files[allImages[0]].name);
        try {
            if (!errors.isEmpty()) {
                // return res.status(400).json({ errors: errors.array() });
                return res.status(200).json({
                    error: true,
                    message: "All fields are required",
                    data: errors,
                });
            }

            /* ------------------------ UPDATE INTO CROP TABLE ----------------------- */

            var crop = await Crop.findOne({ where: { id: req.body.crop_id } });
            if (crop) {
                var updateCrop = await Crop.update(
                    {
                        user_id: req.body.user_id,
                        type: req.body.type,
                        category: req.body.category,
                        sub_category: req.body.sub_category,
                        active: 0,
                        market: "crop",
                        description: req.body.description,
                        // images: my_object.toString(),
                        currency: req.body.currency,
                        is_negotiable: req.body.is_negotiable,
                        video: req.body.video,
                        packaging: req.body.packaging,
                        application: req.body.application,
                        manufacture_name: req.body.manufacture_name,
                        manufacture_date: req.body.manufacture_date,
                        expiration_date: req.body.expiration_date,
                    },
                    { where: { id: req.body.crop_id } }
                );

                /* ------------------------ UPDATE INTO CROP TABLE ----------------------- */

                if (updateCrop) {
                    var updateCropSpecification = await CropSpecification.update(
                        {
                            model_id: crop.id,
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
                            unit: req.body.unit,
                            // liters: req.body.liters
                        },
                        { where: { model_id: req.body.crop_id } }
                    );

                    if (updateCropSpecification) {
                        var updateCropRequest = await CropRequest.update(
                            {
                                crop_id: crop.id,
                                state: req.body.state,
                                zip: req.body.zip,
                                country: req.body.country,
                                address: req.body.address,
                                delivery_method: req.body.delivery_method,
                                delivery_date: req.body.delivery_date,
                                delivery_window: req.body.delivery_window,
                            },
                            { where: { crop_id: req.body.crop_id } }
                        );

                        return res.status(200).json({
                            error: false,
                            message: "Crop edited successfully",
                            // "product": product, Cropspec, ProdRequest
                        });
                    }
                }
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
                route: "/api/crop/editbyid",
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
    // /* ---------------------------- * EDIT Project by ID * ---------------------------- */

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

    static async deactivateCropById(req, res) {
        const errors = validationResult(req);

        try {
            /* ------------------------ UPDATE INTO CROP TABLE ----------------------- */

            var crop = await Crop.findOne({ where: { id: req.params.id } });
            if (crop) {
                crop.active = 0;

                crop.save();

                return res.status(200).json({
                    error: false,
                    message: "Crop deactivated successfully",
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
}

module.exports = CropController;
