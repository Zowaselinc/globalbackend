const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {
    return {
        transaction_id : {
            type: Sequelize.STRING,
            allowNull : false
        },
        transaction_ref : {
            type: Sequelize.STRING,
            allowNull : false
        },
        type : {
            type : Sequelize.STRING,
            allowNull : false
        },
        type_id : {
            type: Sequelize.STRING,
            allowNull : false
        },
        user_id: {
            type : Sequelize.STRING,
            allowNull : false
        },
        amount_paid : {
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