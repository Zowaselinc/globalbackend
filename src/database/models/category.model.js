const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {
    return {
        name : {
            type: Sequelize.STRING,
            unique : true,
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
        ...generateTimestamps(Sequelize,mode)
    }
}
const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("category", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const Category = instance.define("category", Schema(Sequelize,2),{ 
        timestamps: false,
    });
    return Category;
}

module.exports = { Schema , Model};