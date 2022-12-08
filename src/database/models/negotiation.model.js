const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {
    return {
        sender_id : {
            type: Sequelize.INTEGER(11),
            allowNull : false
        },
        receiver_id : {
            type: Sequelize.INTEGER(11),
            allowNull : false
        },
        crop_id : {
            type: Sequelize.INTEGER(11),
            allowNull : false
        },
        type : {
            type: Sequelize.STRING,
            allowNull : false
        },
        message: {
            type: Sequelize.STRING,
            allowNull : false
        },
        messagetype: {
            type: Sequelize.STRING,
            allowNull : false
        },
        status: {
            type: Sequelize.STRING,
            allowNull : true
        },
        admin_id : {
            type: Sequelize.STRING,
            allowNull : true
        },
        ...generateTimestamps(Sequelize,mode)
    }
}
const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("negotiations", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const Negotiations = instance.define("negotiations", Schema(Sequelize,2),{ 
        timestamps: false,
    });
    return Negotiations;
}

module.exports = { Schema , Model};