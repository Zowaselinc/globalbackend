const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {
    return {
        order_hash : {
            type: Sequelize.STRING,
            allowNull : false
        },
        buyer_id : {
            type : Sequelize.STRING,
            allowNull : false
        },
        buyer_type : {
            type : Sequelize.STRING,
            allowNull : false
        },
        negotiation_id : {
            type: Sequelize.STRING,
            allowNull : true
        },
        total : {
            type : Sequelize.STRING,
            allowNull : false
        },
        currency : {
            type : Sequelize.STRING,
            allowNull : false
        },
        payment_option : {
            type: Sequelize.STRING,
        },
        payment_status : {
            type : Sequelize.ENUM( "UNPAID", "PARTIALLY_PAID", "PAID" ),
            allowNull : false
        },
        products : {
            type : Sequelize.TEXT,
            allowNull : false
        },
        tracking_details : {
            type: Sequelize.TEXT,
            allowNull : true
        },
        waybill_details : {
            type: Sequelize.TEXT,
            allowNull : true
        },
        receipt_note : {
            type: Sequelize.TEXT,
            allowNull : true
        },
        extra_documents : {
            type: Sequelize.TEXT,
            allowNull : true
        },
        ...generateTimestamps(Sequelize,mode)
    }
}
const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("orders", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const Order = instance.define("orders", Schema(Sequelize,2),{ timestamps: false });
    return Order;
}

module.exports = { Schema , Model};