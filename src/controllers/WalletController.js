const { validationResult } = require("express-validator");
const { Wallet, Transaction, ErrorLog, UserCode, Withdrawal } = require("~database/models");
const Mailer = require("~services/mailer");

class WalletController {
    /* ------------------------------  ----------------------------- */
    static async getBalance(req, res) {
        try {
            let user = req.global.user;
            let wallet = await Wallet.findOne({
                where: { user_id: user.id }
            });

            if (wallet) {
                return res.status(200).json({
                    error: false,
                    message: "Success",
                    data: { balance: wallet.balance }
                });
            } else {
                return res.status(400).json({
                    error: true,
                    message: "Bad Request",
                    data: {}
                });
            }

        } catch (e) {
            var logError = await ErrorLog.create({
                error_name: "Error on getting wallet balance",
                error_description: e.toString(),
                route: "/api/wallet/balance",
                error_code: "500"
            });
            if (logError) {
                return res.status(500).json({
                    error: true,
                    message: 'Unable to complete request at the moment',
                })

            }
        }
    }

    static async getRecentTransactions(req, res) {
        try {
            let user = req.global.user;
            let transactions = await Transaction.findAll({
                where: { recipient_id: user.id },
                limit: 10
            });

            if (transactions) {
                return res.status(200).json({
                    error: false,
                    message: "Success",
                    data: transactions
                });
            } else {
                return res.status(400).json({
                    error: true,
                    message: "Bad Request",
                    data: {}
                });
            }

        } catch (e) {
            var logError = await ErrorLog.create({
                error_name: "Error on getting recent transactions",
                error_description: e.toString(),
                route: "/api/wallet/recent",
                error_code: "500"
            });
            if (logError) {
                return res.status(500).json({
                    error: true,
                    message: 'Unable to complete request at the moment',
                })
            }
        }
    }

    static async getWithdrawalRequests(req, res) {

        try {
            const withdrawals = await Withdrawal.findAll({
                where: { user_id: req.global.user.id }
            });

            return res.status(200).json({
                error: false,
                data: withdrawals,
                message: "Withdrawals fetched successfully"
            });
        } catch (e) {
            var logError = await ErrorLog.create({
                error_name: "Error fetching withdrawal requests",
                error_description: e.toString(),
                route: "/api/wallet/withdraw",
                error_code: "500"
            });
            if (logError) {
                return res.status(500).json({
                    error: true,
                    message: 'Unable to complete request at the moment',
                })
            }
        }

    }



    static async sendWithdrawalCode(req, res) {

        try {

            function getRandomInt(min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
            }

            var code = getRandomInt(100000, 999999);

            //Check for exixting
            var formerCode = await UserCode.findOne({ where: { email: req.global.user.email, type: "withdrawal" } });

            if (!formerCode) {
                UserCode.create({
                    email: req.global.user.email,
                    type: "withdrawal",
                    code: code
                }).catch(error => {
                    console.log(error.sqlMessage)
                });
            } else {
                UserCode.update({
                    code: code,
                }, {
                    where: { email: req.global.user.email, type: "withdrawal" }
                }).catch(error => {
                    console.log(error.sqlMessage)
                });
            }



            Mailer()
                .to(req.global.user.email).from(process.env.MAIL_FROM)
                .subject('Authorize').template('emails.OTPAuthorization', { code: code }).send();


            return res.status(200).json({
                error: false,
                status: true,
                message: "Code sent successfully"
            });
        } catch (e) {
            var logError = await ErrorLog.create({
                error_name: "Error on sending otp",
                error_description: e.toString(),
                route: "/api/wallet/withdraw/otp",
                error_code: "500"
            });
            if (logError) {
                return res.status(500).json({
                    error: true,
                    message: 'Unable to complete request at the moment',
                })
            }
        }

    }

    static async sendWithdrawalRequest(req, res) {

        const errors = validationResult(req);

        try {

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    error: true,
                    message: "All fields are required",
                    data: errors,
                });
            }

            // Check withdrawal code
            const withdrawCode = await UserCode.findOne({
                where: {
                    email: req.global.user.email,
                    type: "withdrawal"
                }
            });

            if (!withdrawCode || withdrawCode.code != req.body.code) {

                return res.status(400).json({
                    error: true,
                    message: "Invalid otp",
                });

            } else {

                // Check for pending withdrawal

                const pendingWithdrawal = await Withdrawal.findOne({
                    where: {
                        user_id: req.global.user.id,
                        status: "pending"
                    }
                });

                if (pendingWithdrawal) {

                    return res.status(400).json({
                        error: true,
                        message: "You have a pending withdrawal already",
                    });

                } else {

                    const wallet = await Wallet.findOne({
                        where: { user_id: req.global.user.id }
                    });

                    if (eval(wallet.balance) < eval(req.body.amount)) {
                        return res.status(400).json({
                            error: true,
                            message: "Insufficient funds",
                        });
                    } else {
                        const withdrawalRequest = await Withdrawal.create({
                            user_id: req.global.user.id,
                            amount: req.body.amount,
                            status: "pending"
                        });

                        return res.status(200).json({
                            error: false,
                            message: "Request posted successfully"
                        });
                    }

                }

            }

        } catch (e) {
            var logError = await ErrorLog.create({
                error_name: "Error on sending withdrawal request",
                error_description: e.toString(),
                route: "/api/wallet/withdraw",
                error_code: "500"
            });
            if (logError) {
                return res.status(500).json({
                    error: true,
                    message: 'Unable to complete request at the moment',
                })
            }
        }



    }
}
module.exports = WalletController;
