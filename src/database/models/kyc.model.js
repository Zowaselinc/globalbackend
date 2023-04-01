const generateTimestamps = require("./timestamps");

let Schema = (Sequelize, mode) => {
    return {
        user_id: {
            type: Sequelize.STRING,
            allowNull: false
        },
        applicant_id: {
            type: Sequelize.STRING
        },
        check_id: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.ENUM("pending", "complete", "failed")
        },
        bvn: {
            type: Sequelize.STRING
        },
        verified: {
            type: Sequelize.INTEGER
        },
        ...generateTimestamps(Sequelize, mode)
    }
}
const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("kyc", Schema(Sequelize, 1), { timestamps: false });
    // Bypass initial instance to cater for timestamps
    const Kyc = instance.define("kyc", Schema(Sequelize, 2), { timestamps: false });
    return Kyc;
}

module.exports = { Schema, Model };