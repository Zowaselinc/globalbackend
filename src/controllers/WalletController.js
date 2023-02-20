
const jwt = require("jsonwebtoken");
const { Wallet, ErrorLog } = require("~database/models");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const Mailer = require('~services/mailer');
const md5  = require('md5');
const { reset } = require("nodemon");
const { use } = require("~routes/api");

const crypto = require('crypto');
const { capitalize } = require("~utilities/string");



class WalletController{
   
    /* ---------------------------- * GRAB WALLET DETAILS * ---------------------------- */
    static async getWalletByUserId(req , res){

        const errors = validationResult(req);
        try {
            var findWallet = await Wallet.findAll({
                where: { user_id: req.global.user.id }
            });

            if (findWallet.length > 0) {
                return res.status(200).json({
                    error: false,
                    message: "Wallet retrieved successfully",
                    data: findWallet
                })
            } else {
                return res.status(400).json({
                    error: true,
                    message: "No Wallet found",
                    data: []
                })
            }
        } catch (e) {
            var logError = await ErrorLog.create({
                error_name: "Error on getting all Wallet details by userID",
                error_description: e.toString(),
                route: `/api/wallet/user_id`,
                error_code: "500"
            });
            if (logError) {
                return res.status(500).json({
                    error: true,
                    message: 'Unable to complete request at the moment'+e.toString()
                })
            }
        }
    }
    /* ---------------------------- * GRAB WALLET DETAILS * ---------------------------- */

}

module.exports = WalletController;