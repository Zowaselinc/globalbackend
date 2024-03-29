const jwt = require("jsonwebtoken");

const {
    Pricing,
    Transaction,
    Order,
    ErrorLog,
    Negotiation,
    CropSpecification,
    Crop,
    CropRequest,
    Cart,
    Input,
    User,
    Notification,
} = require("~database/models");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const Mailer = require('~services/mailer');
const md5 = require("md5");
const { reset } = require("nodemon");
const { use } = require("~routes/api");
require('dotenv').config();

const crypto = require("crypto");
const {
    IncludeBuyer,
    IncludeNegotiation,
    CropIncludes,
} = require("~database/helpers/modelncludes");
const { Op } = require("sequelize");

class OrderController {
  
    /* ---------------------------- * CREATE NEW ORDER * ---------------------------- */
    static async createNewOrderOld(req, res) {

        const errors = validationResult(req);

        try {
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: true,
                    message: "All fields required",
                    data: [],
                });
            }

            const randomid = crypto.randomBytes(16).toString("hex");


            let negotiation_id;

            const accept_offer_type = req.body.accept_offer_type;
            const cropId = req.body.crop_id;

            /*************************************************************************************
             * IF NEGOTIATION ID IS SENT FROM PAYLOAD, IT MEANS THE OFFER WAS DIRECTLY ACCEPTED, *
             *               IF NOT THERE WAS A NEGOTIATION BEFORE ACCEPTING OFFER               *
             * *************************************************************************************/
            // accept_offer_type is direct or negotiation

            let theproduct;

            var findWantedCrops = await Crop.findOne({
                where: { type: "offer", id: req.body.crop_id },
            });

            if (!findWantedCrops) {
                return res.status(200).json({
                    error: true,
                    message:
                        "Sorry could not proceed, Crop with this specifications is not found.",
                    data: [],
                });
            } else if (
                accept_offer_type == "" ||
                accept_offer_type == null ||
                accept_offer_type == undefined
            ) {
                return res.status(200).json({
                    error: true,
                    message:
                        "Please indicate if you are accepting the offer directly or through a negotiation",
                    data: [],
                });
            } else if (accept_offer_type == "direct") {
                // If accept_offer_type=="direct" get the crop details using its id
                negotiation_id = null;
                var findCrop = await Crop.findOne({
                    include: [
                        {
                            model: CropSpecification,
                            as: "crop_specification",
                            order: [["id", "DESC"]],
                            limit: 1,
                        },
                        {
                            model: CropRequest,
                            as: "crop_request",
                            order: [["id", "DESC"]],
                            limit: 1,
                        },
                    ],

                    where: { id: cropId, type: "offer" },
                    order: [["id", "DESC"]],
                });

                theproduct = findCrop;
            } else if (accept_offer_type == "negotiation") {
                negotiation_id = parseInt(req.body.negotiation_id);

                const { count, rows } = await Negotiation.findAndCountAll({
                    where: {
                        id: negotiation_id,
                        status: "accepted",
                    },
                });

                if (count < 1) {
                    return res.status(200).json({
                        error: true,
                        message: `No accepted negotiation offer found`,
                        data: [],
                    });
                } else {
                    var findCropNegotiationOffers = await Negotiation.findAndCountAll({
                        include: [
                            {
                                model: CropSpecification,
                                as: "crop_specification",
                                order: [["id", "DESC"]],
                                limit: 1,
                            },
                        ],

                        where: {
                            messagetype: "offer",
                            status: "accepted",
                        },
                        order: [["id", "DESC"]],
                        attributes: [
                            "sender_id",
                            "receiver_id",
                            "crop_id",
                            "messagetype",
                            "status",
                            "created_at",
                        ],
                    });

                    /* --------------------- If fetched the accepted/declined Negotiation Transaction --------------------- */

                    const findCrop = await Crop.findOne({
                        where: {
                            id: findCropNegotiationOffers.rows[0].crop_id,
                        },
                    });

                    const findCropRequest = await CropRequest.findOne({
                        where: {
                            crop_id: findCropNegotiationOffers.rows[0].crop_id,
                        },
                    });

                    var obj = new Object();
                    obj = {
                        cropData: findCrop,
                        cropSpecificationData: findCropRequest,
                        negotiation: findCropNegotiationOffers,
                    };

                    theproduct = obj;
                }
            }

            var createOrder = await Order.create({
                order_hash: "ORD" + randomid,
                buyer_id: req.body.buyer_id,
                buyer_type: req.body.buyer_type,
                negotiation_id: negotiation_id,
                payment_option: req.body.payment_option,
                payment_status: req.body.payment_status,
                product: JSON.stringify(theproduct),
                tracking_details: req.body.tracking_details,
                waybill_details: req.body.waybill_details,
                receipt_note: req.body.receipt_note,
                extra_documents: req.body.extra_documents,
            });

            return res.status(200).json({
                error: false,
                message: "New order created",
                data: createOrder,
            });
        } catch (e) {
            var logError = await ErrorLog.create({
                error_name: "Error on creating an order",
                error_description: e.toString(),
                route: "/api/crop/order/add",
                error_code: "500",
            });
            return res.status(500).json({
                error: true,
                message: "Unable to complete request at the moment " + e.toString(),
            });
        }
    }
    
    /* ---------------------------- * CREATE NEW ORDER * ---------------------------- */
    static async createNewOrder(req, res) {
     

        const errors = validationResult(req);

        try {
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: true,
                    message: "All fields required",
                    data: [],
                });
            }

            var randomid = crypto.randomBytes(16).toString("hex");

            var createOrder = await Order.create({
                order_hash: "ORD" + randomid,
                buyer_id: req.body.buyer_id,
                buyer_type: req.body.buyer_type,
                negotiation_id: negotiation_id,
                payment_option: req.body.payment_option,
                payment_status: req.body.payment_status,
                product: JSON.stringify(theproduct),
                tracking_details: req.body.tracking_details,
                waybill_details: req.body.waybill_details,
                receipt_note: req.body.receipt_note,
                extra_documents: req.body.extra_documents,
            });

            return res.status(200).json({
                error: false,
                message: "New order created",
                data: createOrder,
            });
        } catch (e) {
            var logError = await ErrorLog.create({
                error_name: "Error on creating an order",
                error_description: e.toString(),
                route: "/api/crop/order/add",
                error_code: "500",
            });
            return res.status(500).json({
                error: true,
                message: "Unable to complete request at the moment " + e.toString(),
            });
        }
    }
    /* ---------------------------- * CREATE NEW ORDER * ---------------------------- */

    static async createCartOrder(req, res) {
        const errors = validationResult(req);

        try {
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: true,
                    message: "All fields required",
                    data: [],
                });
            }

            var getUserCart = await Cart.findAll({
                where: { user_id: req.global.user.id },
                include: [{ model: Input }],
            });

            var sellerGroups = {};

            var cartTotal = 0;
            getUserCart.forEach(async (item) => {
                cartTotal += eval(item.price) * eval(item.quantity);

                //Deduct available stock for product;
                var input = await Input.findOne({
                    where: { id: item.input.id }
                });
                input.stock = eval(input.stock) - eval(item.quantity);
                await input.save();

                //Group same seller items together
                if (sellerGroups[input.user_id]) {
                    sellerGroups[input.user_id].push(item);
                } else {
                    sellerGroups[input.user_id] = [item];
                }
            });


            // Create orders by seller groups

            var allOrders = [];

            Object.values(sellerGroups).forEach(async (group) => {

                var groupTotal = 0;
                group.forEach(item => {
                    groupTotal += (eval(item.quantity) * eval(item.price));
                })

                var randomId = crypto.randomBytes(16).toString("hex").toUpperCase();

                // Create order
                var order = await Order.create({
                    order_hash: "ORD" + randomId,
                    buyer_id: req.global.user.id,
                    buyer_type: "merchant",
                    seller_id: group[0].user_id,
                    negotiation_id: null,
                    total: groupTotal,
                    currency: "NGN",
                    payment_status: "UNPAID",
                    waybill_details: JSON.stringify(req.body.delivery_details),
                    products: JSON.stringify(group),
                });

                allOrders.push(order);
            });



            return res.status(200).json({
                error: false,
                message: "New order created",
                data: {
                    orders: allOrders,
                    total: cartTotal
                },
            });
        } catch (e) {
            var logError = await ErrorLog.create({
                error_name: "Error on creating an order",
                error_description: e.toString(),
                route: "/api/order/cart/create",
                error_code: "500",
            });
            return res.status(500).json({
                error: true,
                message: "Unable to complete request at the moment " + e.toString(),
            });
        }
    }

    /* ---------------------------- * FULFIL CROP OFFER * ---------------------------- */
    static async fulfilCropOffer(req, res) {
        const errors = validationResult(req);

        try {
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: true,
                    message: "All fields required",
                    data: [],
                });
            }

            const randomid = crypto.randomBytes(16).toString("hex");

            let products = await Crop.findAll({
                include: CropIncludes,
                where: {
                    id: req.params.id,
                },
            });

            var tracking_details = {
                pickup_location: products[0].warehouse_address,
                transit: [],
                delivery_location: "",
            };

            var createOrder = await Order.create({
                order_hash: "ORD" + randomid,
                buyer_id:
                    products[0].type == "wanted"
                        ? products[0].user_id
                        : req.global.user.id,
                buyer_type:
                    products[0].type == "wanted" ? "corporate" : req.global.user.type,
                seller_id:
                    products[0].type == "wanted"
                        ? req.global.user.id
                        : products[0].user_id,
                negotiation_id: null,
                total: eval(req.body.quantity) * eval(products[0].specification.price),
                currency: products[0].currency,
                payment_status: "UNPAID",
                tracking_details: JSON.stringify(tracking_details),
                products: JSON.stringify(products),
            });

            /* ------------------------------ NOTIFICATION ------------------------------ */
            if(createOrder){
                var createNotification = await Notification.create({
                    notification_name: "New Order #"+createOrder.order_hash,
                    message: "Offer accepted without negotiation",
                    single_seen: 0,
                    general_seen: 0,
                    model: "order",
                    model_id: createOrder.order_hash,
                    buyer_id: products[0].type == "wanted" ? products[0].user_id : req.body.user_id,
                    buyer_type: products[0].type == "wanted" ? "corporate" : req.body.user_type,
                    seller_id: products[0].type == "wanted" ? req.global.user.id : products[0].user_id,
                    notification_to:  products[0].type == "wanted" ? "corporate" : "merchant",
                })
            }
            /* ------------------------------ NOTIFICATION ------------------------------ */

            var buyer = await User.findByPk(createOrder.buyer_id);
            var seller = await User.findByPk(createOrder.seller_id);
            var crop = products[0];
            var refererUrl = req.headers.referer;

            if (req.body.quantity) {
                var cropSpecification = await CropSpecification.findOne({
                    where: {
                        model_type: "crop",
                        model_id: crop.id
                    }
                });
                cropSpecification.qty = eval(cropSpecification.qty) - eval(req.body.quantity);
                cropSpecification.save();
            }

            // Send offer accepted email
            var offerOwner = products[0].type == "wanted" ? buyer : seller;
            Mailer()
                .to(offerOwner.email).from(process.env.MAIL_FROM)
                .subject('Crop offer accepted').template('emails.AcceptedCropOffer', {
                    name: offerOwner.first_name,
                    cropQuantity: crop.specification.qty + crop.specification.test_weight,
                    cropTitle: crop.subcategory.name + "-" + crop.specification.color,
                    orderLink: `${refererUrl}dashboard/marketplace/order/${createOrder.order_hash}`,
                    orderHash: createOrder.order_hash
                }).send();

            // Send offer confimation email
            var offerFulfiler = products[0].type == "wanted" ? seller : buyer;
            Mailer()
                .to(offerFulfiler.email).from(process.env.MAIL_FROM)
                .subject('Offer confirmation').template('emails.OfferConfirmation', {
                    name: offerFulfiler.first_name,
                    cropQuantity: crop.specification.qty + crop.specification.test_weight,
                    cropTitle: crop.subcategory.name + "-" + crop.specification.color,
                    orderLink: `${refererUrl}dashboard/marketplace/order/${createOrder.order_hash}`,
                    orderHash: createOrder.order_hash
                }).send();

            return res.status(200).json({
                error: false,
                message: "New order created",
                data: createOrder,
            });
        } catch (e) {
            var logError = await ErrorLog.create({
                error_name: "Error on creating an order",
                error_description: e.toString(),
                route: "/api/crop/:id/fulfil",
                error_code: "500",
            });
            return res.status(500).json({
                error: true,
                message: "Unable to complete request at the moment " + e.toString(),
            });
        }
    }
    
    /* -------------------------- GET ORDER BY ORDER_ID ------------------------- */
    static async getByOrderHash(req, res) {
        const errors = validationResult(req);

        try {
            var findOrder = await Order.findOne({
                where: { order_hash: req.params.order },
                include: [IncludeBuyer, IncludeNegotiation],
            });
            if (findOrder) {
                return res.status(200).json({
                    error: false,
                    message: "Order retrieved successfully",
                    data: findOrder,
                });
            } else {
                return res.status(400).json({
                    error: true,
                    message: "No order found",
                    data: findOrder,
                });
            }
        } catch (e) {
            var logError = await ErrorLog.create({
                error_name: "Error on getting all orders by order_id",
                error_description: e.toString(),
                route: `/api/crop/order/getbyorderid/${req.params.orderid}`,
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
  
    /* -------------------------- GET ORDER BY BUYER_ID ------------------------- */
    static async getByBuyer(req, res) {
        const errors = validationResult(req);

        try {
            var findOrder = await Order.findAll({
                where: { buyer_id: req.params.id },
                order: [["id", "DESC"]],
            });
            if (findOrder && findOrder.length) {
                return res.status(200).json({
                    error: false,
                    message: "Order retrieved successfully",
                    data: findOrder,
                });
            } else {
                return res.status(200).json({
                    error: false,
                    message: "No order found",
                    data: findOrder,
                });
            }
        } catch (e) {
            var logError = await ErrorLog.create({
                error_name: "Error on getting all orders by buyerid",
                error_description: e.toString(),
                route: `/users/${req.params.id}/orders`,
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
    
    /* -------------------------- GET ORDER BY BUYER_ID ------------------------- */
    static async getBySeller(req, res) {
        const errors = validationResult(req);

        try {
            var findOrder = await Order.findAll({
                where: { seller_id: req.params.id },
                order: [["id", "DESC"]],
            });
            if (findOrder && findOrder.length) {
                return res.status(200).json({
                    error: false,
                    message: "Sales retrieved successfully",
                    data: findOrder,
                });
            } else {
                return res.status(200).json({
                    error: false,
                    message: "No sales found",
                    data: findOrder,
                });
            }
        } catch (e) {
            var logError = await ErrorLog.create({
                error_name: "Error on getting all orders by buyerid",
                error_description: e.toString(),
                route: `/users/${req.params.id}/sales`,
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
   
    /* -------------------------- GET ORDER BY NEGOTIATION_ID ------------------------- */
    static async getByNegotiationId(req, res) {
        try {
            var findOrder = await Order.findOne({
                where: { negotiation_id: req.params.negotiationid },
            });
            if (findOrder) {
                return res.status(200).json({
                    error: false,
                    message: "Order retrieved successfully",
                    data: findOrder,
                });
            } else {
                return res.status(400).json({
                    error: true,
                    message: "No order found",
                    data: findOrder,
                });
            }
        } catch (e) {
            var logError = await ErrorLog.create({
                error_name: "Error on getting all orders by negotiationId",
                error_description: e.toString(),
                route: `/api/crop/order/getbynegotiationid/${req.params.negotiationid}`,
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
        /* -------------------------- GET ORDER BY PAYMENT STATUS ------------------------- */
    static async getByPaymentStatus(req, res) {
        try {
            var findOrder = await Order.findOne({
                where: { payment_status: req.params.paymentstatus },
            });
            if (findOrder) {
                return res.status(200).json({
                    error: false,
                    message: "Order retrieved successfully",
                    data: findOrder,
                });
            } else {
                return res.status(400).json({
                    error: true,
                    message: "No order found",
                    data: findOrder,
                });
            }
        } catch (e) {
            var logError = await ErrorLog.create({
                error_name: "Error on getting all orders by negotiationId",
                error_description: e.toString(),
                route: `/api/crop/order/paymentstatus/${req.params.paymentstatus}`,
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
   
    /* -------------------------- UPDATE TRACKING DETAILS BY ORDER_ID ------------------------- */
    static async updateTrackingDetailsByOrderId(req, res) {
        const errors = validationResult(req);

        try {
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: true,
                    message: "All fields required",
                    data: [],
                });
            }

            var findOrder = await Order.findOne({
                where: { order_hash: req.params.order },
            });
            if (findOrder) {
                let thetrackingDetails = JSON.stringify(req.body.tracking_details);

                var updateOrderTrackingDetails = await Order.update(
                    {
                        tracking_details: thetrackingDetails,
                    },
                    { where: { order_hash: req.params.order } }
                );

                let order = await Order.findOne({
                    where: { order_hash: req.params.order }
                });

                var buyer = await User.findByPk(order.buyer_id);
                var refererUrl = req.headers.referer;

                Mailer()
                    .to(buyer.email).from(process.env.MAIL_FROM)
                    .subject('Delivery update').template('emails.TrackingUpdate', {
                        name: buyer.first_name,
                        orderLink: `${refererUrl}dashboard/marketplace/${req.params.order}/tracking`,
                        orderHash: req.params.order
                    }).send();

                return res.status(200).json({
                    error: false,
                    message: "Tracking details updated successfully",
                    data: [],
                });
            } else {
                return res.status(400).json({
                    error: true,
                    message: "No order found",
                    data: findOrder,
                });
            }
        } catch (e) {
            var logError = await ErrorLog.create({
                error_name: "Error on updating oder tracking details by orderId",
                error_description: e.toString(),
                route: `/api/crop/order/trackingdetails/updatebyorderid`,
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

    /* -------------------------- UPDATE WAYBILL DETAILS BY ORDER_ID  ------------------------- */
    static async updateWaybillDetailsByOrderId(req, res) {
        const errors = validationResult(req);

        try {
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: true,
                    message: "All fields required",
                    data: [],
                });
            }

            var findOrder = await Order.findOne({
                where: { order_hash: req.params.order },
            });
            if (findOrder) {
        

                let theWaybillDetails = JSON.stringify(req.body.waybill_details);

                var updateOrderWaybillDetails = await Order.update(
                    {
                        waybill_details: theWaybillDetails,
                    },
                    { where: { order_hash: req.params.order } }
                );

                return res.status(200).json({
                    error: false,
                    message: "Waybill order details updated successfully",
                    data: [],
                });
            } else {
                return res.status(400).json({
                    error: true,
                    message: "No order found",
                    data: findOrder,
                });
            }
        } catch (e) {
            var logError = await ErrorLog.create({
                error_name: "Error on updated waybill order by orderId",
                error_description: e.toString(),
                route: `/api/crop/order/waybilldetails/updatebyorderid`,
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
    
    /* -------------------------- UPDATE GOOD RECEIPT NOTE BY ORDER_ID  ------------------------- */
    static async updateGoodReceiptNoteByOrderId(req, res) {
        const errors = validationResult(req);

        try {
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: true,
                    message: "All fields required",
                    data: errors,
                });
            }

            var findOrder = await Order.findOne({
                where: { order_hash: req.params.order },
            });
            if (findOrder) {

                let theGoodReceiptDetails = JSON.stringify(req.body.good_receipt_note);

                var updateGoodReceiptDetails = await Order.update(
                    {
                        receipt_note: theGoodReceiptDetails,
                    },
                    { where: { order_hash: req.params.order } }
                );

                return res.status(200).json({
                    error: false,
                    message: "Receipt note updated successfully",
                    data: [],
                });
            } else {
                return res.status(400).json({
                    error: true,
                    message: "No order found",
                    data: findOrder,
                });
            }
        } catch (e) {
            var logError = await ErrorLog.create({
                error_name: "Error on updating receipt note by orderId",
                error_description: e.toString(),
                route: `/api/crop/goodreceiptnote/updatebyorderid`,
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

    /* -------------------------------------------------------------------------- */
    /*                                    INPUT                                   */
    /* -------------------------------------------------------------------------- */

    static async createInputOrder(req, res) {
      
        const errors = validationResult(req);

        try {
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: true,
                    message: "All fields required",
                    data: [],
                });
            }

            const randomid = crypto.randomBytes(16).toString("hex");

            var findtheInput = await Input.findOne({
                where: { id: req.body.input_id },
            });

            if (!findtheInput) {
                return res.status(200).json({
                    error: true,
                    message: "Sorry Input does not exist.",
                    data: [],
                });
            }

            var createOrder = await Order.create({
                order_hash: "ORD" + randomid,
                buyer_id: req.body.buyer_id,
                buyer_type: req.body.buyer_type,
                payment_option: req.body.payment_option,
                product: req.body.input_id,
                waybill_details: req.body.waybill_details,
                payment_status: req.body.payment_status,
                extra_documents: "payment processor data",
            });

            return res.status(200).json({
                error: false,
                message: "New input order created",
                data: { order_hash: createOrder.order_id },
            });
        } catch (e) {
            var logError = await ErrorLog.create({
                error_name: "Error on creating an order",
                error_description: e.toString(),
                route: "/api/input/order/add",
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


    /* ----------------- get all cart added by a specified user ----------------- */

    static async updateOrderPayment(req, res) {
        const errors = validationResult(req);
        try {
            /* ----------------- checking the req.body for empty fields ----------------- */
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: true,
                    message: "All fields required",
                    data: [],
                });
            }

            /* ---------------- check if the item is already in the cart ---------------- */
            var returnedResult = await Order.findOne(req.body, {
                where: {
                    order_hash: req.body.order_id,
                },
            });

            if (returnedResult) {
                var executeCommand = await Order.update(
                    {
                        payment_status: req.body.payment_status,
                        extra_documents: JSON.stringify(req.body.extra_documents),
                    },
                    {
                        where: {
                            order_hash: req.body.order_id,
                        },
                    }
                );

                return res.status(200).json({
                    error: false,
                    message: "Order updated successfully",
                    data: executeCommand,
                });
            } else {
                return res.status(200).json({
                    error: true,
                    message: "Order does not exist",
                    data: [],
                });
            }
        } catch (error) {
            var logError = await ErrorLog.create({
                error_name: "Error on updating input order",
                error_description: error.toString(),
                route: "/api/input/order/updateinputorder",
                error_code: "500",
            });

            return res.status(500).json({
                error: true,
                message: "Unable to complete the request at the moment",
                data: [],
            });
        }
    }

    static async getOrderHistoryByUserId(req, res) {
        try {
            /* ----------------- the user id supplied as a get param ---------------- */
            const user_id = req.params.user_id;

            if (user_id !== "" || user_id !== null || user_id !== undefined) {
                /* ---------------- check if the delivery address exists ---------------- */
                var returnedResult = await Order.findAll({
                    attributes: [
                        "id",
                        "order_hash",
                        "buyer_id",
                        "buyer_type",
                        "payment_option",
                        "payment_status",
                        "product",
                        "tracking_details",
                        "extra_documents",
                        "created_at",
                    ],
                    where: {
                        buyer_id: user_id,
                    },
                });

                if (returnedResult) {
                    return res.status(200).json({
                        error: false,
                        message: "Order history retrieved successfully",
                        data: returnedResult,
                    });
                } else {
                    return res.status(200).json({
                        error: true,
                        message: "No order history found for this user",
                        data: [],
                    });
                }
            } else {
                return res.status(400).json({
                    error: true,
                    message: "Invalid user id",
                    data: [],
                });
            }
        } catch (error) {
            var logError = await ErrorLog.create({
                error_name: "Error on getting order history",
                error_description: error.toString(),
                route: "/api/input/order/history/getbyuserid/:user_id",
                error_code: "500",
            });

            return res.status(500).json({
                error: true,
                message: "Unable to complete the request at the moment",
                data: [],
            });
        }
    }

    static async saveDeliveryDetails(req, res) {
        const errors = validationResult(req);
        try {
            /* ----------------- checking the req.body for empty fields ----------------- */
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: true,
                    message: "All fields required",
                    data: errors,
                });
            }

            /* ---------------- check if the item is already in the cart ---------------- */
            var order = await Order.findOne({
                where: {
                    order_hash: req.params.order,
                },
            });

            if (order) {
                //Check if order is input order or crop order
                if (order.products.includes("input_id")) {
                    var executeCommand = await Order.update(
                        {
                            waybill_details: JSON.stringify({
                                address: req.body.address,
                                country: req.body.country,
                                state: req.body.state,
                                city: req.body.city,
                                zip: req.body.zip,
                            }),
                        },
                        {
                            where: {
                                order_hash: req.params.order,
                            },
                        }
                    );

                    return res.status(200).json({
                        error: false,
                        message: "Order updated successfully",
                        data: executeCommand,
                    });
                } else {
                    var tracking_details = JSON.parse(order.tracking_details);
                    var dd = req.body;
                    tracking_details.delivery_location = `${dd.address}, ${dd.city}, ${dd.state}, ${dd.zip}, ${dd.country}`;
                    order.tracking_details = JSON.stringify(tracking_details);
                    await order.save();

                    return res.status(200).json({
                        error: false,
                        message: "Order updated successfully",
                        data: executeCommand,
                    });
                }
            } else {
                return res.status(400).json({
                    error: true,
                    message: "Order does not exist",
                    data: [],
                });
            }
        } catch (error) {
            var logError = await ErrorLog.create({
                error_name: "Error on updating input order",
                error_description: error.toString(),
                route: `/api/order/${req.params.order}/delivery`,
                error_code: "500",
            });

            return res.status(500).json({
                error: true,
                message: "Unable to complete the request at the moment",
                data: [],
            });
        }
    }
}

module.exports = OrderController;
