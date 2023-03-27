const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {
    return {
        notification_name : {
            type : Sequelize.STRING,
            allowNull : false
        },
        message : {
            type : Sequelize.TEXT,
            allowNull : false
        },
        single_seen : {
            type : Sequelize.INTEGER(11),
            allowNull : false
        },
        general_seen : {
            type : Sequelize.INTEGER(11),
            allowNull : false
        },
        model : {
            type : Sequelize.STRING,
            allowNull : false
        },
        model_id : {
            type : Sequelize.STRING,
            allowNull : false
        },
        buyer_id : {
            type : Sequelize.INTEGER(11),
            allowNull : true
        },
        buyer_type : {
            type : Sequelize.STRING,
            allowNull : false
        },
        seller_id : {
            type: Sequelize.INTEGER(11),
            allowNull : true
        },
        notification_to : {
            type: Sequelize.STRING,
            allowNull : true
        },
        ...generateTimestamps(Sequelize,mode)
    }
}
const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("notifications", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const Notification = instance.define("notifications", Schema(Sequelize,2),{ 
        timestamps: false,
    });
    return Notification;
}

module.exports = { Schema , Model};