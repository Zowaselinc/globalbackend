const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {
    return {
        user_id : {
            type: Sequelize.INTEGER,
            allowNull : false
        },
        address : {
            type : Sequelize.STRING,
            allowNull : false
        },
        zip : {
            type : Sequelize.STRING,
            allowNull : false
        },
        state : {
            type : Sequelize.STRING,
            allowNull : false
        },
        country : {
            type : Sequelize.STRING,
            allowNull : false
        },
        ...generateTimestamps(Sequelize, mode)
    }
}
const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("delivery_address", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    
    const DeliveryAddress = instance.define("delivery_address", Schema(Sequelize,2),{ 
        timestamps: false 
    });
    return DeliveryAddress;
}

module.exports = { Schema , Model};