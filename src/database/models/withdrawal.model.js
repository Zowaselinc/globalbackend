const generateTimestamps = require("./timestamps");

let Schema = (Sequelize, mode) => {
    return {
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        amount: {
            type: Sequelize.STRING,
            allowNull: false
        },
        status: {
            type: Sequelize.ENUM('pending', 'completed', "failed"),
            allowNull: false
        },
        ...generateTimestamps(Sequelize, mode)
    }
}
const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("withdrawals", Schema(Sequelize, 1), { timestamps: false });
    // Bypass initial instance to cater for timestamps
    const Withdrawal = instance.define("withdrawals", Schema(Sequelize, 2), { timestamps: false });
    return Withdrawal;
}

module.exports = { Schema, Model };