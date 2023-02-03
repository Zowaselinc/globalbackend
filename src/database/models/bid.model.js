const generateTimestamps = require("./timestamps");

let Schema = (Sequelize, mode) => {

    return {
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        crop_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        amount: {
            type: Sequelize.STRING,
            allowNull: false
        },
        ...generateTimestamps(Sequelize, mode)
    }
}

const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("bids", Schema(Sequelize, 1), { timestamps: false });
    // Bypass initial instance to cater for timestamps
    const Cart = instance.define("bids", Schema(Sequelize, 2), {
        timestamps: false,
    });
    return Cart;
}

module.exports = { Schema, Model };