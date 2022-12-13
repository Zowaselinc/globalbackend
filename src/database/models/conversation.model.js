const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {
    return {
        // Participant identifiers generated using 'P' + (USER ID) + '#'
        user_one : {
            type : Sequelize.INTEGER(11),
            allowNull : false
        },
        user_two : {
            type : Sequelize.INTEGER(11),
            allowNull : false
        },
        type : {
            type: Sequelize.STRING,
            allowNull : false
        },
        crop_id : {
            type : Sequelize.INTEGER(11)
        },
        ...generateTimestamps(Sequelize,mode)
    }
}
const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("conversations", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const Conversation = instance.define("conversations", Schema(Sequelize,2),{ 
        timestamps: false,
    });
    return Conversation;
}

module.exports = { Schema , Model};