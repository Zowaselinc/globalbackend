const generateTimestamps = require("./timestamps");

let Schema = (Sequelize, mode) => {
    return {
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        first_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        last_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        ...generateTimestamps(Sequelize, mode)
    }
}
const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("team_memebers", Schema(Sequelize, 1), { timestamps: false });
    // Bypass initial instance to cater for timestamps
    const TeamMembers = instance.define("team_memebers", Schema(Sequelize, 2), { timestamps: false });
    return TeamMembers;
}

module.exports = { Schema, Model };