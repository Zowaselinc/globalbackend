const { request } = require("express");
const { Input, ErrorLog, Cart } = require("~database/models");
const { validationResult } = require("express-validator");
const crypto = require("crypto");
// const jwt = require("jsonwebtoken");

class InputsCart {

    static async addtoCart(req, res) {
        const errors = validationResult(req);
        try {

            /* ----------------- checking the req.body for empty fields ----------------- */
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: true,
                    message: "All fields required",
                    data: errors
                });
            }

            /* ---------------- check if the item is already in the cart ---------------- */
            var checkCart = await Cart.findAll({
                where: {
                    "user_id": req.body.user_id,
                    "input_id": req.body.input_id
                }
            });

            /* -------------------------------- Get input ------------------------------- */
            var input = await Input.findOne({
                where: { id: req.body.input_id }
            });

            if (!input) {
                return res.status(400).json({
                    error: true,
                    message: "Invalid Request",
                    data: []
                })
            } else {
                req.body.price = input.price;
            }

            if (checkCart.length > 0) {
                /* ------------------------- update existing record ------------------------- */
                var makeRequest = await Cart.update(req.body, {
                    where: {
                        "user_id": req.body.user_id,
                        "input_id": req.body.input_id
                    }
                });
            } else {
                /* --------------------- insert the product into the DB --------------------- */
                var makeRequest = await Cart.create(req.body);
            }

            if (makeRequest) {
                return res.status(200).json({
                    error: false,
                    message: "Item added to cart successfully",
                    data: []
                })
            } else {
                return res.status(400).json({
                    error: true,
                    message: "Unable to complete the request at the moment",
                    data: []
                })
            }



        } catch (error) {
            var logError = await ErrorLog.create({
                error_name: "Error on adding input to cart-+",
                error_description: error.toString(),
                route: "/api/input/cart/add",
                error_code: "500"
            });

            return res.status(500).json({
                error: true,
                message: "Unable to complete the request at the moment",
                data: []
            })
        }

    }

    /* ----------------- get all cart added by a specified user ----------------- */
    static async getUserInputCart(req, res) {
        try {

            /* ----------------- the user id supplied as a get param ---------------- */
            const userid = req.params.user_id;

            if (userid !== "" || userid !== null || userid !== undefined) {

                /* ---------------- check if the item is already in the cart ---------------- */
                var returnedResult = await Cart.findAll({
                    include: [{
                        model: Input,
                        as: "input"
                    }],
                    where: {
                        "user_id": userid
                    }
                });

                if (returnedResult.length > 0) {

                    return res.status(200).json({
                        error: false,
                        message: "User cart retrieved successfully",
                        data: returnedResult
                    })

                } else {
                    return res.status(200).json({
                        error: true,
                        message: "Unable to complete the request at the moment",
                        data: returnedResult
                    })
                }
            } else {
                return res.status(200).json({
                    error: true,
                    message: "Invalid user id",
                    data: returnedResult
                })
            }



        } catch (error) {
            var logError = await ErrorLog.create({
                error_name: "Error on getting all cart items by user",
                error_description: error.toString(),
                route: "/api/input/cart/getallcartbyuserid/:user_id",
                error_code: "500"
            });

            return res.status(500).json({
                error: true,
                message: "Unable to complete the request at the moment",
                data: []
            })
        }

    }

    static async deleteCartItem(req, res) {
        try {

            /* ----------------- the user id supplied as a get param ---------------- */
            const id = req.params.id;

            if (id !== "" || id !== null || id !== undefined) {

                /* ---------------- check if the item is already in the cart ---------------- */
                var returnedResult = await Cart.findOne({
                    where: {
                        "id": id
                    }
                });

                if (returnedResult) {

                    var deleteit = await Cart.destroy({
                        where: {
                            "id": id
                        }
                    })

                    if (deleteit) {

                        return res.status(200).json({
                            error: false,
                            message: "Cart Item deleted successfully",
                            data: []
                        })

                    } else {

                        return res.status(400).json({
                            error: true,
                            message: "Invalid request.",
                            data: []
                        })

                    }


                } else {
                    return res.status(200).json({
                        error: true,
                        message: "Cart Item does not exist",
                        data: []
                    })
                }
            } else {
                return res.status(400).json({
                    error: true,
                    message: "Invalid user id",
                    data: returnedResult
                })
            }



        } catch (error) {
            var logError = await ErrorLog.create({
                error_name: "Error on getting all cart items by user",
                error_description: error.toString(),
                route: "/api/input/cart/getallcartbyuserid/:user_id",
                error_code: "500"
            });

            return res.status(500).json({
                error: true,
                message: "Unable to complete the request at the moment",
                data: []
            })
        }
    }

}

module.exports = InputsCart;