//Import validation result
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const { Negotiation, ErrorLog, CropSpecification, Crop, Conversation, User, Category, Order, CropRequest } = require('~database/models');
const { Op } = require('sequelize');
const { request } = require('http');
const ConversationController = require('./ConversationController');
const { IncludeNegotiations, IncludeCrop, CropIncludes, IncludeSpecification } = require('~database/helpers/modelncludes');
const Mailer = require('~services/mailer');
require('dotenv').config();

class NegotiationController {

    static async hello(req, res) {

        return res.status(200).json({
            message: "Hello Negotiation"
        });
    }


    /* ---------------------------- * USER ADD NEGOTIATION MESSAGE * ---------------------------- */
    static async add(req, res) {

        // return res.status(200).json({
        //     message : "Add Category"
        // });

        const errors = validationResult(req);

        try {

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: true,
                    message: "All fields required",
                    data: []
                });
            }

            var conversation = await Conversation.findOne({
                where: {
                    [Op.or]: [
                        { user_one: req.body.sender_id, user_two: req.body.receiver_id },
                        { user_two: req.body.sender_id, user_one: req.body.receiver_id },
                    ],
                    type: "negotiation",
                    crop_id: req.body.crop_id
                }
            });

            if (!conversation) {
                conversation = await Conversation.create({
                    user_one: req.body.sender_id,
                    user_two: req.body.receiver_id,
                    type: "negotiation",
                    crop_id: req.body.crop_id
                });
                req.body.conversation_id = conversation.id;
            } else {
                req.body.conversation_id = conversation.id;
            }


            // console.log(errors.isEmpty());
            let randomid = crypto.randomBytes(8).toString('hex');
            let messagetype = "text";
            req.body.messagetype = messagetype;
            var negotiation = await Negotiation.create(req.body)

            return res.status(200).json({
                "error": false,
                "message": "Message sent",
                "data": negotiation
            })
        } catch (e) {
            var logError = await ErrorLog.create({
                error_name: "Error on adding negotiation message",
                error_description: e.toString(),
                route: "/api/crop/negotiation/add",
                error_code: "500"
            });
            if (logError) {
                return res.status(500).json({
                    error: true,
                    message: 'Unable to complete request at the moment'
                })
            }
        }


    }
    /* ---------------------------- * USER ADD NEGOTIATION MESSAGE * ---------------------------- */






    /* --------------------------- GET ALL NEGOTIATION BY USERID --------------------------- */
    static async getbyuserid(req, res) {

        const userId = req.params.userid;
        const cropId = req.params.cropId;

        try {

            if (userId !== "" || userId !== null || userId !== undefined) {


                var conversation = await Conversation.findOne({
                    where: {
                        [Op.or]: [
                            { user_one: userId },
                            { user_two: userId }
                        ],
                        crop_id: cropId
                    },
                    include: [
                        IncludeNegotiations
                    ]
                })


                if (conversation) {
                    return res.status(200).json({
                        error: false,
                        message: "Negotiations and messages retrieved successfully",
                        data: conversation.negotiations
                    })

                } else {

                    return res.status(400).json({
                        error: true,
                        message: "No negotiations made by this user",
                        data: []
                    })

                }
            } else {
                return res.status(400).json({
                    error: true,
                    message: "Invalid user ID",
                    data: []
                })
            }
        } catch (e) {
            var logError = await ErrorLog.create({
                error_name: "Error on getting negotiation",
                error_description: e.toString(),
                route: `/api/crop/${cropId}/negotiation/getbyuserid/${userId}`,
                error_code: "500"
            });
            if (logError) {
                return res.status(500).json({
                    error: true,
                    message: 'Unable to complete request at the moment'
                })
            }
        }
    }
    /* --------------------------- GET ALL NEGOTIATION BY USERID --------------------------- */




    /* ------------------ GET ALL NEGOTIATION LIST BY USER ID ----------------- */

    static async getListByUser(req, res) {

        try {
            const userId = req.params.userid;

            if (userId !== "" || userId !== null || userId !== undefined) {

                var conversations = await Conversation.findAll({
                    where: {
                        [Op.or]: [
                            { user_one: userId },
                            { user_two: userId }
                        ],
                        type: "negotiation",
                    },
                    include: [
                        IncludeCrop,
                        { model: User, as: "initiator", required: true },
                        { model: User, as: "participant", required: true },
                        IncludeNegotiations
                    ],
                });

                if (conversations) {

                    return res.status(200).json({
                        error: false,
                        message: "Conversations retrieved successfully",
                        data: conversations
                    })

                } else {

                    return res.status(400).json({
                        error: true,
                        message: "No negotiations made by this user",
                        data: []
                    })

                }
            } else {
                return res.status(400).json({
                    error: true,
                    message: "Invalid user ID",
                    data: []
                })
            }
        } catch (e) {
            var logError = await ErrorLog.create({
                error_name: "Error on getting negotiation",
                error_description: e.toString(),
                route: "/api/crop/negotiation/getlist/:userid",
                error_code: "500"
            });
            if (logError) {
                return res.status(500).json({
                    error: true,
                    message: 'Unable to complete request at the moment'
                })
            }
        }
    }
    /* --------------------------- GET ALL NEGOTIATION BY USERID --------------------------- */






    /* ---------------------------- * SEND NEGOTIATION * ---------------------------- */
    static async sendNegotiationOffer(req, res) {

        // return res.status(200).json({
        //     message : "Add Category"
        // });

        const errors = validationResult(req);

        try {

            // if(!errors.isEmpty()){
            //     return res.status(400).json({ 
            //          errors: errors.array() 
            //     });
            // }

            var obj = new Object();
            obj = {
                "qty": req.body.qty,
                "price": req.body.price,
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
                "infestation": req.body.infestation,
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
            }

            let stringifiedObj = JSON.stringify(obj);


            var conversation = await Conversation.findOne({
                where: {
                    [Op.or]: [
                        { user_one: req.body.sender_id, user_two: req.body.receiver_id },
                        { user_two: req.body.sender_id, user_one: req.body.receiver_id },
                    ],
                    type: "negotiation",
                    crop_id: req.body.crop_id
                }
            });

            if (!conversation) {
                conversation = await Conversation.create({
                    user_one: req.body.sender_id,
                    user_two: req.body.receiver_id,
                    type: "negotiation",
                    crop_id: req.body.crop_id
                });
                req.body.conversation_id = conversation.id;
            } else {
                req.body.conversation_id = conversation.id;
            }

            // return res.send(aa);

            // console.log(errors.isEmpty());
            let randomid = crypto.randomBytes(8).toString('hex');

            var sendnegotiation = await Negotiation.create({
                sender_id: req.body.sender_id,
                receiver_id: req.body.receiver_id,
                conversation_id: req.body.conversation_id,
                crop_id: req.body.crop_id,
                type: req.body.type,
                message: stringifiedObj,
                messagetype: "offer"
            })


            // SEND INFORMATION TO PRODUCT SPECIFICATION TABLE //
            if (sendnegotiation) {
                var createCropSpecification = await CropSpecification.create({
                    model_id: sendnegotiation.id,
                    model_type: "negotiation",
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
                })
            }
            // SEND INFORMATION TO PRODUCT SPECIFICATION TABLE //



            return res.status(200).json({
                "error": false,
                "message": "New negotiation offer sent",
                "data": sendnegotiation
            })
        } catch (e) {
            var logError = await ErrorLog.create({
                error_name: "Error on sending a new negotiation offer",
                error_description: e.toString(),
                route: "/api/crop/negotiation/sendoffer",
                error_code: "500"
            });
            if (logError) {
                return res.status(500).json({
                    error: true,
                    message: 'Unable to complete request at the moment'
                })
            }
        }


    }
    /* ---------------------------- * SEND NEGOTIATION * ---------------------------- */







    /* --------------------------- ACCEPT NEGOTIATION BY NEGOIATION ID --------------------------- */
    static async acceptNegotiation(req, res) {

        const errors = validationResult(req);

        try {

            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            var offer = await Negotiation.findOne({
                where: { id: req.body.id },
                include: [
                    IncludeSpecification
                ]
            });

            if (offer) {

                offer.status = "accepted";

                await offer.save();

                // Create Order For Offer

                const randomId = crypto.randomBytes(16).toString('hex').toUpperCase();

                const conversation = await Conversation.findByPk(offer.conversation_id);


                const products = await Crop.findAll({
                    where: { id: conversation.crop_id },
                    include: CropIncludes
                });

                var tracking_details = {
                    pickup_location: products[0].warehouse_address,
                    transit: [],
                    delivery_location: ""
                };

                var order = await Order.create({
                    order_hash: "ORD" + randomId,
                    buyer_id: offer.type == "corporate" ? offer.sender_id : offer.receiver_id,
                    buyer_type: "corporate",
                    seller_id: offer.type == "corporate" ? offer.receiver_id : offer.sender_id,
                    negotiation_id: offer.id,
                    total: eval(offer.specification.qty) * eval(offer.specification.price),
                    currency: products[0].currency,
                    payment_status: "UNPAID",
                    tracking_details: JSON.stringify(tracking_details),
                    products: JSON.stringify(products),
                });

                var buyer = await User.findByPk(order.buyer_id);
                var seller = await User.findByPk(order.seller_id);
                var crop = products[0];
                var refererUrl = req.headers.referer;

                // Send offer accepted email
                var offerSender = offer.sender_id == buyer.id ? buyer : seller;
                Mailer()
                    .to(offerSender.email).from(process.env.MAIL_FROM)
                    .subject('Crop offer accepted').template('emails.AcceptedCropOffer', {
                        name: offerSender.first_name,
                        cropQuantity: crop.specification.qty + crop.specification.test_weight,
                        cropTitle: crop.subcategory.name + "-" + crop.specification.color,
                        orderLink: `${refererUrl}dashboard/marketplace/order/${order.order_hash}`,
                        orderHash: order.order_hash
                    }).send();

                // Send offer confimation email
                var offerReceiver = offer.receiver_id == buyer.id ? buyer : seller;
                Mailer(offerReceiver.email)
                    .to().from(process.env.MAIL_FROM)
                    .subject('Offer confirmation').template('emails.OfferConfirmation', {
                        name: offerReceiver.first_name,
                        cropQuantity: crop.specification.qty + crop.specification.test_weight,
                        cropTitle: crop.subcategory.name + "-" + crop.specification.color,
                        orderLink: `${refererUrl}dashboard/marketplace/order/${order.order_hash}`,
                        orderHash: order.order_hash
                    }).send();

                // Reduce crop offer if partial offer fulfilment
                if (offer.messagetype == "offer") {
                    if (offer.specification.qty) {
                        var cropSpecification = await CropSpecification.findOne({
                            where: {
                                model_type: "crop",
                                model_id: crop.id
                            }
                        });
                        cropSpecification.qty = eval(cropSpecification.qty) - eval(offer.specification.qty);
                        cropSpecification.save();
                    }
                }

                return res.status(200).json({
                    error: false,
                    message: "Negotiation offer accepted successfully",
                    data: { offer: offer, order: order }
                })

            } else {

                return res.status(400).json({
                    error: true,
                    message: "No offer found",
                    data: []
                })

            }

        } catch (error) {
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
    static async declineNegotiation(req, res) {

        // return res.status(200).json({
        //     message : "Accept Negotiation"
        // });

        try {

            const id = parseInt(req.body.id);

            if (id !== "" || id !== null || id !== undefined) {

                var declineNegotiations = await Negotiation.update({
                    status: "declined"
                }, {
                    where: {
                        id: id
                    },
                    attributes: ['sender_id', 'receiver_id', 'type', 'message', 'status', 'created_at'],
                });

                if (declineNegotiations) {

                    return res.status(200).json({
                        error: false,
                        message: "Negotiation offer declined successfully",
                        data: declineNegotiations
                    })

                } else {

                    return res.status(400).json({
                        error: true,
                        message: "No offer found",
                        data: []
                    })

                }
            } else {
                return res.status(400).json({
                    error: true,
                    message: "Invalid request",
                    data: []
                })
            }



        } catch (error) {
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


    /* --------------------------- CLOSE NEGOTIATION BY NEGOIATION ID --------------------------- */
    static async closeNegotiation(req, res) {

        try {

            const id = parseInt(req.body.id);

            if (id !== "" || id !== null || id !== undefined) {

                var closeNegotiation = await Negotiation.update({
                    status: "closed"
                }, {
                    where: {
                        id: id
                    },
                    attributes: ['sender_id', 'receiver_id', 'type', 'message', 'status', 'created_at'],
                });

                if (closeNegotiation) {

                    return res.status(200).json({
                        error: false,
                        message: "Negotiation offer closed successfully",
                        data: closeNegotiation
                    })

                } else {

                    return res.status(400).json({
                        error: true,
                        message: "No offer found",
                        data: []
                    })

                }
            } else {
                return res.status(400).json({
                    error: true,
                    message: "Invalid request",
                    data: []
                })
            }



        } catch (error) {
            var logError = await ErrorLog.create({
                error_name: "Error on declining negotiation offer",
                error_description: error.toString(),
                route: "/api/crop/negotiation/close",
                error_code: "500"
            });

            return res.status(500).json({
                error: true,
                message: "Unable to complete the request at the moment",
                data: []
            })
        }
    }
    /* --------------------------- CLOSE NEGOTIATION BY NEGOIATION ID --------------------------- */





    /* --------------------------- TRANSACTION SUMMARY -------------------------- */
    /*****************************************************************************
     * THIS CONTAINS INFORMATION OF FINAL AGREEMENT IE. THE ACCEPTED OFFER_PRICE *
     *      GET TRANSACTIONS FOR USER, THEN VIEW SINGLE TRANSACTION DETAILS      *
     *****************************************************************************/

    /********************************************************************
     * GET ALL NEGOTIATION BY TRANSACTIONS BY STATUS(ACCEPTED/DECLINED/CLOSED) *
     *                            AND USERID                            *
     ********************************************************************/
    static async getNegotiationTransactionSummary(req, res) {

        const userId = req.params.userid;
        const negotiationStatus = req.params.status;
        try {

            const { count, rows } = await Negotiation.findAndCountAll({
                where: {
                    messagetype: "offer",
                    status: negotiationStatus,
                    [Op.or]: [
                        { receiver_id: userId },
                        { sender_id: userId }
                    ]
                }
            });

            if (count < 1) {
                return res.status(200).json({
                    error: true,
                    message: `No ${negotiationStatus} negotiation offer found`,
                    data: []
                })
            } else {
                var findCropNegotiationOffers = await Negotiation.findAll({
                    include: [{
                        model: CropSpecification,
                        as: 'specification',
                        order: [['id', 'DESC']],
                        // limit: 1,
                    }],


                    where: {
                        messagetype: "offer",
                        status: negotiationStatus,
                        [Op.or]: [
                            { receiver_id: userId },
                            { sender_id: userId }
                        ]
                    },
                    order: [['id', 'DESC']]
                });


                /* --------------------- If fetched the accepted/declined Negotiation Transaction --------------------- */

                /*******************************************************************************************************
                 *       TO GET THE CROP_ID, I STARTED FROM THE NEGOTIATION TABLE. THE TABLE HAS CONVERSATION_ID       *
                 * I USED THE CONVERSATION_ID TO TAKE ME TO THE CONVERSATION TABLE. IN THIS TABLE,I GRABBED THE CROP_ID *
                 *******************************************************************************************************/

                const findConversation = await Conversation.findOne({
                    where: {
                        id: findCropNegotiationOffers[0].conversation_id
                    }
                });

                const findCrop = await Crop.findOne({
                    where: {
                        id: findConversation.crop_id
                    }
                });

                const findCropRequest = await CropRequest.findOne({
                    where: {
                        crop_id: findConversation.crop_id
                    }
                });


                return res.status(200).json({
                    error: false,
                    message: `Negotiation for ${negotiationStatus} Crops offer retrieved successfully`,
                    data: findCropNegotiationOffers,
                    cropData: findCrop,
                    cropRequestData: findCropRequest
                })
            }


        } catch (e) {

            console.log(e);
            var logError = await ErrorLog.create({
                error_name: `Error on fetching ${negotiationStatus} crops negotiation offer`,
                error_description: e.toString(),
                route: `/api/crop/grabtransactionby/${negotiationStatus}/${userId}`,
                error_code: "500"
            });
            if (logError) {
                return res.status(500).json({
                    error: true,
                    message: e.toString()
                })
            }
        }
    }


    /* --------------------------- TRANSACTION SUMMARY -------------------------- */









    /* ----------- GET ALL ACCEPTED AND DECLINED NEGOTIATIONS SUMMARY ----------- */
    static async getAllNegotiationTransactionSummary(req, res) {

        try {

            const { count, rows } = await Negotiation.findAndCountAll({
                where: {
                    messagetype: "offer"
                }
            });

            if (count < 1) {
                return res.status(200).json({
                    error: true,
                    message: `No transactions for negotiation offer found`,
                    data: []
                })
            } else {
                var findCropNegotiationOffers = await Negotiation.findAndCountAll({
                    include: [{
                        model: CropSpecification,
                        as: 'specification',
                        order: [['id', 'DESC']],
                        // limit: 1,
                    }],


                    where: {
                        messagetype: "offer"
                    },
                    order: [['id', 'DESC']]
                });


                /* --------------------- If fetched the accepted/declined Negotiation Transaction --------------------- */

                /*******************************************************************************************************
                 *       TO GET THE CROP_ID, I STARTED FROM THE NEGOTIATION TABLE. THE TABLE HAS CONVERSATION_ID       *
                 * I USED THE CONVERSATION_ID TO TAKE ME TO THE CONVERSATION TABLE. IN THIS TABLE,I GRABBED THE CROP_ID *
                 *******************************************************************************************************/

                const findConversation = await Conversation.findOne({
                    where: {
                        id: findCropNegotiationOffers.rows[0].conversation_id
                    }
                });


                const findCrop = await Crop.findOne({
                    where: {
                        id: findConversation.crop_id
                    }
                });

                const findCropRequest = await CropRequest.findOne({
                    where: {
                        crop_id: findConversation.crop_id
                    }
                });


                return res.status(200).json({
                    error: false,
                    message: `Negotiation for Crops offer retrieved successfully`,
                    data: findCropNegotiationOffers,
                    cropData: findCrop,
                    cropRequestData: findCropRequest
                })
            }


        } catch (e) {
            var logError = await ErrorLog.create({
                error_name: `Error on fetching crops negotiation offer`,
                error_description: e.toString(),
                route: `/api/crop/negotiation/getallsummary`,
                error_code: "500"
            });
            if (logError) {
                return res.status(500).json({
                    error: true,
                    message: e.toString()
                })
            }
        }
    }
    /* ----------- GET ALL ACCEPTED AND DECLINED NEGOTIATIONS SUMMARY ----------- */



}

module.exports = NegotiationController;