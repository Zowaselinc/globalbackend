const { validationResult } = require("express-validator");
const { Crop, ErrorLog, Order } = require("~database/models");

class AnalyticsController {
    /* ------------------------------  ----------------------------- */
    static async getStatistics(req, res) {
        try {
            let user = req.global.user;

            let allCropSales = await Order.findAll({
                where: { seller_id: user.id },
            });

            let cropSalesCount = allCropSales.length;

            let offers = await Crop.findAll({
                where: { user_id: user.id, active: 1 }
            });

            let analyticsData = {
                inputsSold: null,
                cropsSold: cropSalesCount,
                pendingOffers: offers.length
            };

            return res.status(200).json({
                error: false,
                message: "Success",
                data: analyticsData
            });

        } catch (e) {
            var logError = await ErrorLog.create({
                error_name: "Error on getting anylytics data",
                error_description: e.toString(),
                route: "/api/analytics",
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
module.exports = AnalyticsController;
