const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {
    return {
        email : {
            type: Sequelize.STRING,
            unique : false,
            allowNull : false
        },
        type : {
            type: Sequelize.STRING,
            unique : false,
            allowNull : false
        },
        code : {
            type: Sequelize.STRING,
            unique : false,
            allowNull : false
        },
        ...generateTimestamps(Sequelize,mode)
    }
}
const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("user_codes", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const UserCode = instance.define("user_codes", Schema(Sequelize,2),{ timestamps: false });
    return UserCode;
}

module.exports = { Schema , Model};