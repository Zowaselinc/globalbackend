const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {
    return {
        user_id: {
            type : Sequelize.INTEGER,
            allowNull : false
        },
        balance : {
            type : Sequelize.STRING,
            allowNull : false
        },
        ...generateTimestamps(Sequelize,mode)
    }
}
const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("wallets", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const Wallet = instance.define("wallets", Schema(Sequelize,2),{ timestamps: false });
    return Wallet;
}

module.exports = { Schema , Model};