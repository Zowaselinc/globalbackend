const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {
    return {
        product_id : {
            type: Sequelize.INTEGER,
            allowNull : false
        },
        state : {
            type : Sequelize.STRING,
        },
        zip : {
            type : Sequelize.STRING,
        },
        country : {
            type : Sequelize.STRING,
        },
        address : {
            type : Sequelize.STRING,
        },
        delivery_method : {
            type : Sequelize.STRING,
        },
        delivery_date : {
            type : Sequelize.STRING,
        },
        delivery_window : {
            type : Sequelize.STRING,
        },
        ...generateTimestamps(Sequelize,mode)
    }
}
const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("product_requests", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const ProductRequest = instance.define("product_requests", Schema(Sequelize,2),{ timestamps: false });
    return ProductRequest;
}

module.exports = { Schema , Model};