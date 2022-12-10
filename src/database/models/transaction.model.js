const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {
    return {
        transaction_id : {
            type: Sequelize.STRING,
            allowNull : false
        },
        amount : {
            type : Sequelize.STRING,
            allowNull : false
        },
        method : {
            type: Sequelize.STRING,
            allowNull : false
        },
        type : {
            type: Sequelize.STRING,
            allowNull : false
        },
        status : {
            type: Sequelize.STRING,
            allowNull : false
        },   
        ...generateTimestamps(Sequelize,mode)
    }
}
const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("transactions", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const Transaction = instance.define("transactions", Schema(Sequelize,2),{ timestamps: false });
    return Transaction;
}

module.exports = { Schema , Model};