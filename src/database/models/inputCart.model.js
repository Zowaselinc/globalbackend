const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {

    return {
        user_id : {
            type : Sequelize.STRING,
            allowNull : false
        },
        product_id : {
            type : Sequelize.STRING,
            allowNull : false
        },
        quantity : {
            type : Sequelize.STRING,
            allowNull : false
        },
        price:{
            type: Sequelize.STRING,
            allowNull: false
        },
        ...generateTimestamps(Sequelize,mode)
    }
}

const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("input_cart", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const InputCart = instance.define("input_cart", Schema(Sequelize,2),{ 
        timestamps: false,
    });
    return InputCart;
}

module.exports = { Schema , Model};