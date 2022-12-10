const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {
    return {
        order_id : {
            type: Sequelize.STRING,
            allowNull : false
        },
        amount : {
            type : Sequelize.STRING,
            allowNull : false
        },
        total_product : {
            type: Sequelize.STRING,
            allowNull : false
        },
        action : {
            type: Sequelize.STRING,
            allowNull : false
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