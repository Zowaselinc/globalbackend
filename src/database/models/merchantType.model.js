const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {
    return {
        title : {
            type : Sequelize.STRING,
            allowNull : false
        },
        ...generateTimestamps(Sequelize,mode)
    }
}
const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("merchant_types", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const MerchantTypes = instance.define("merchant_types", Schema(Sequelize,2),{ timestamps: false });
    return MerchantTypes;
}

module.exports = { Schema , Model};