const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {
    return {
        user_id : {
            type: Sequelize.INTEGER,
            allowNull : false
        },
        client_id : {
            type : Sequelize.INTEGER,
            allowNull : false
        },
        token : {
            type: Sequelize.STRING,
            unique : true,
            allowNull : false
        },
        expires_at : {
            type: Sequelize.DATE,
            allowNull : false
        },
        ...generateTimestamps(Sequelize, mode)
    }
}
const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("access_tokens", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const AccessTokens = instance.define("access_tokens", Schema(Sequelize,2),{ timestamps: false });
    return AccessTokens;
}

module.exports = { Schema , Model};