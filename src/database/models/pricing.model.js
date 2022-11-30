const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {
    return {
        user_id : {
            type: Sequelize.STRING,
            allowNull : false
        },
        client_id : {
            type : Sequelize.STRING,
            allowNull : false
        },
        package : {
            type: Sequelize.STRING,
            allowNull : false
        },
        ...generateTimestamps(Sequelize,mode)
    }
}
const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("pricing", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const Pricing = instance.define("pricing", Schema(Sequelize,2),{ timestamps: false });
    return Pricing;
}

module.exports = { Schema , Model};