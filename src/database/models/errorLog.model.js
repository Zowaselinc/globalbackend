const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {

    return {
        error_name : {
            type: Sequelize.STRING,
            allowNull : false
        },
        error_description : {
            type : Sequelize.STRING
        },
        route : {
            type : Sequelize.STRING,
            allowNull : false
        },
        error_code:{
            type: Sequelize.STRING,
            allowNull: false
        },
        ...generateTimestamps(Sequelize,mode)
    }
}

const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("errorlog", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const ErrorLog = instance.define("errorlog", Schema(Sequelize,2),{ 
        timestamps: false,
    });
    return ErrorLog;
}

module.exports = { Schema , Model};