const generateTimestamps = require("./timestamps");

let Schema = (Sequelize, mode) => {
    return {
        user_id: {
            type: Sequelize.STRING,
            allowNull: false
        },
        tax_id: {
            type: Sequelize.STRING
        },
        cac: {
            type: Sequelize.STRING,
        },
        financial_statement: {
            type: Sequelize.STRING,
        },
        mou: {
            type: Sequelize.STRING,
        },
        check_id: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.ENUM("pending", "complete", "failed")
        },
        ...generateTimestamps(Sequelize, mode)
    }
}
const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("kyb", Schema(Sequelize, 1), { timestamps: false });
    // Bypass initial instance to cater for timestamps
    const Kyb = instance.define("kyb", Schema(Sequelize, 2), { timestamps: false });
    return Kyb;
}

module.exports = { Schema, Model };