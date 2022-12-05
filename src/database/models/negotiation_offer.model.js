const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {
    return {
        user_id : {
            type : Sequelize.INTEGER,
            allowNull : false
        },
        product_id : {
            type: Sequelize.INTEGER,
            allowNull : false
        },
        ...generateTimestamps(Sequelize,mode)
    }
}
const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("negotiation_offers", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const NegotiationOffer = instance.define("negotiation_offers", Schema(Sequelize,2),{ timestamps: false });
    return NegotiationOffer;
}

module.exports = { Schema , Model};