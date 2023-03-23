const generateTimestamps = require("./timestamps");

let Schema = (Sequelize, mode) => {
    return {
        user_id: {
            type: Sequelize.INTEGER,
            unique: true,
            allowNull: false
        },
        company_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        company_address: {
            type: Sequelize.STRING
        },
        company_email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        company_phone: {
            type: Sequelize.STRING,
            allowNull: false
        },
        state: {
            type: Sequelize.STRING,
            allowNull: false
        },
        country: {
            type: Sequelize.STRING,
            allowNull: false
        },
        rc_number: {
            type: Sequelize.STRING,
            allowNull: false
        },
        ...generateTimestamps(Sequelize, mode)
    }
}
const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("companies", Schema(Sequelize, 1), { timestamps: false });
    // Bypass initial instance to cater for timestamps
    const Company = instance.define("companies", Schema(Sequelize, 2), { timestamps: false });
    return Company;
}

module.exports = { Schema, Model };