const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {
    return {
        user_id : {
            type: Sequelize.INTEGER(11),
            allowNull : false
        },
        title : {
            type: Sequelize.STRING,
            allowNull : false
        },
        type : {
            type: Sequelize.STRING,
            allowNull : false
        },
        category_id : {
            type: Sequelize.STRING,
            allowNull : false
        },
        subcategory_id : {
            type: Sequelize.STRING,
            // allowNull : false
        },
        active : {
            type: Sequelize.INTEGER(11),
            allowNull : false
        },
        description : {
            type: Sequelize.STRING,
            allowNull : false
        },
        images : {
            type: Sequelize.STRING,
            // allowNull : false
        },
        currency : {
            type: Sequelize.STRING,
            allowNull : false
        },
        is_negotiable : {
            type: Sequelize.INTEGER(11),
            allowNull : false
        },
        video : {
            type: Sequelize.STRING,
            // allowNull : false
        },
        packaging : {
            type: Sequelize.STRING,
            allowNull : false
        },
        application : {
            type: Sequelize.STRING,
            allowNull : false
        },
        ...generateTimestamps(Sequelize,mode)
    }
}
const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("crops", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const Crops = instance.define("crops", Schema(Sequelize,2),{ 
        timestamps: false,
    });
    return Crops;
}

module.exports = { Schema , Model};