const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {
    return {
        user_id : {
            type: Sequelize.INTEGER,
            allowNull : false
        },
        delivery_address_id : {
            type: Sequelize.INTEGER,
            allowNull : false
        },
        transaction_id: {
            type: Sequelize.STRING
        },
        delivery_method : {
            type : Sequelize.STRING,
            allowNull : false
        },
        payment_method : {
            type : Sequelize.STRING,
            allowNull : false
        },
        orders : {
            type : Sequelize.TEXT,
            allowNull : false
        },
        total_price: {
            type: Sequelize.INTEGER(11),
            allowNull: false
        },
        ...generateTimestamps(Sequelize, mode)
    }
}
const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("input_order", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    
    const InputOrder = instance.define("input_order", Schema(Sequelize,2),{ 
        timestamps: false 
    });
    return InputOrder;
}

module.exports = { Schema , Model};