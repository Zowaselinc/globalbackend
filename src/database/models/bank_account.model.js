const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {
    return {
        user_id : {
            type : Sequelize.INTEGER,
            allowNull : false
        },
        bank_name : {
            type : Sequelize.STRING,
            allowNull : false
        },
        account_name : {
            type : Sequelize.STRING,
            allowNull : false
        },
        account_number : {
            type : Sequelize.STRING,
            allowNull : false
        },
        bank_code : {
            type : Sequelize.STRING,
            allowNull : false
        },
        ...generateTimestamps(Sequelize,mode)
    }
}
const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("bank_accounts", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const BankAccount = instance.define("bank_accounts", Schema(Sequelize,2),{ timestamps: false });
    return BankAccount;
}

module.exports = { Schema , Model};