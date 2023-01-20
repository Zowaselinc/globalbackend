const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {
    return {
        category_id : {
            type: Sequelize.STRING,
            allowNull : false
        },
        name : {
            type: Sequelize.STRING,
            allowNull : false
        },
        type : {
            type: Sequelize.STRING,
            allowNull : false
        },
        ...generateTimestamps(Sequelize,mode)
    }
}
const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("subcategory", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const SubCategory = instance.define("subcategory", Schema(Sequelize,2),{ 
        timestamps: false,
    });
    return SubCategory;
}

module.exports = { Schema , Model};