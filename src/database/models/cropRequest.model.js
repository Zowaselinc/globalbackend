const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {

    return {
        crop_id : {
            type: Sequelize.INTEGER(11),
            allowNull : false
        },
        state : {
            type: Sequelize.STRING,
            allowNull : false
        },  
        zip : {
            type: Sequelize.STRING,
            allowNull : false
        },
        country : {
            type: Sequelize.STRING,
            allowNull : false
        },
        address : { 
            type: Sequelize.STRING,
            allowNull : false
        },
        delivery_method : {
            type: Sequelize.STRING,
            allowNull : false
        },
        delivery_date : {
            type: Sequelize.STRING,
            allowNull : false
        },
        delivery_window : {
            type: Sequelize.STRING,
            allowNull : false
        },
        ...generateTimestamps(Sequelize,mode)
    }
}

const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("crop_requests", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const CropRequest = instance.define("crop_requests", Schema(Sequelize,2),{ 
        timestamps: false,
    });
    return CropRequest;
}

module.exports = { Schema , Model};