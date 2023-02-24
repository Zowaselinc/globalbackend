
const jwt = require("jsonwebtoken");


const { Notification, ErrorLog } = require("~database/models");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const Mailer = require('~services/mailer');
const md5 = require('md5');
const { reset } = require("nodemon");
const { use } = require("~routes/api");


const crypto = require('crypto');
const { } = require("~database/helpers/modelncludes");
const { Op } = require("sequelize");
const e = require("express");



class NotificationController {

    static async hello(req, res) {

        return res.status(200).json({
            message: "Hello Order"
        });
    }


    /* -------------------------- FETCH NOTIFICATIONS BY USERTYPE AND USERID ------------------------- */
    static async getAllNotificationByUserTypeandID(req, res) {
        const errors = validationResult(req);
        try {
            var findNotification = await Notification.findAll({ 
                where: {
                    [Op.or]: [
                        { buyer_id: req.params.user_id },
                        { seller_id: req.params.user_id }
                    ],
                    notification_to: req.params.usertype,
                }, 
            });
            if (findNotification && findNotification.length) {
                return res.status(200).json({
                    error: false,
                    message: "Notification retrieved successfully",
                    data: findNotification
                })
            } else {
                return res.status(200).json({
                    error: false,
                    message: "No Notification found",
                    data: findNotification
                })
            }
        } catch (e) {
            var logError = await ErrorLog.create({
                error_name: "Error on getting all orders by buyerid",
                error_description: e.toString(),
                route: `/users/${req.params.id}/orders`,
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
    /* -------------------------- FETCH NOTIFICATIONS BY USERTYPE AND USERID ------------------------- */

    /* ------------------- UPDATE GENERAL NOTIFICATION TO SEEN ------------------ */
    static async updateGeneralNotificationToSeen(req, res) {

        // return res.status(200).json({
        //     message : "Accept Negotiation"
        // });

        try {

            var findNotification = await Notification.findAll({
                
                where: {
                    notification_to: "corporate",
                    buyer_id: req.global.user.id,
                    buyer_type: req.global.user.type
                }
            })

            if(findNotification.length){

                var seenAllNotificationsGenerally = await Notification.update({
                    general_seen: 1
                }, {
                    where: {
                        notification_to: "corporate",
                        buyer_id: req.global.user.id,
                        buyer_type: req.global.user.type
                    }
                });

                return res.status(200).json({
                    error: false,
                    message: "Notifiation updated successfully",
                    data: []
                })
            }else{
                return res.status(400).json({
                    error: true,
                    message: "No notification",
                    data: []
                })
            }
        } catch (error) {
            var logError = await ErrorLog.create({
                error_name: "Error on updating notification general_seen",
                error_description: error.toString(),
                route: "/api/notification/general_seen/updatebyuser",
                error_code: "500"
            });

            return res.status(500).json({
                error: true,
                message: "Unable to complete the request at the moment "+e.toString(),
                data: []
            })
        }
    }
    /* ------------------- UPDATE GENERAL NOTIFICATION TO SEEN ------------------ */

    /* ------------------- UPDATE SINGLE NOTIFICATION TO SEEN ------------------ */
    static async updateSingleNotificationToSeen(req, res) {
        // return res.status(200).json({
        //     message : "Accept Negotiation"
        // });
        let notification_id = req.params.notification_id;

        try {
            var findNotification = await Notification.findAll({     
                where: {
                    id: notification_id
                }
            })

            if(findNotification.length){
                var seenSingleNotifications = await Notification.update({
                    single_seen: 1,
                    general_seen: 1
                }, {
                    where: {
                        id: notification_id
                    }
                });

                return res.status(200).json({
                    error: false,
                    message: "Notifiation updated successfully",
                    data: []
                })

            }else{
                return res.status(400).json({
                    error: true,
                    message: "No notification",
                    data: []
                })
            }
        } catch (error) {
            var logError = await ErrorLog.create({
                error_name: "Error on updating notification single_seen",
                error_description: error.toString(),
                route: `/api/notification/${notification_id}/updatesingle_seen`,
                error_code: "500"
            });

            return res.status(500).json({
                error: true,
                message: "Unable to complete the request at the moment "+e.toString(),
                data: []
            })
        }
    }
    /* ------------------- UPDATE SINGLE NOTIFICATION TO SEEN ------------------ */

}

module.exports = NotificationController;