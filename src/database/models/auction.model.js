const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {
    return {
        crop_id : {
            type : Sequelize.INTEGER,
            allowNull : false
        },
        auction_enddate : {
            type : Sequelize.STRING,
            allowNull : false
        },
        status : {
            type : Sequelize.INTEGER,
            allowNull : false
        },
        ...generateTimestamps(Sequelize, mode)
    }
}
const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("auctions", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const Auction = instance.define("auctions", Schema(Sequelize,2),{ timestamps: false });
    return Auction;
}

module.exports = { Schema , Model};