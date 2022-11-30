const generateTimestamps = require("./timestamps");

let Schema = (Sequelize, mode) => {
    return {
        user_id : {
            type: Sequelize.INTEGER,
            unique : true,
            allowNull : false
        },
        type : {
            type : Sequelize.STRING,
        },
        ...generateTimestamps(Sequelize, mode)
    }
}
const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("buyers", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const Buyer = instance.define("buyers", Schema(Sequelize,2),{ timestamps: false });
    return Buyer;
}

module.exports = { Schema , Model};