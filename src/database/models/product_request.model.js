const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {
    return {
        user_id : {
            type: Sequelize.INTEGER,
            allowNull : false
        },
        image : {
            type : Sequelize.STRING,
        },
        type : {
            type : Sequelize.STRING,
            allowNull : false
        },
        category : {
            type: Sequelize.STRING,
            allowNull : false
        },
        sub_category : {
            type: Sequelize.STRING,
            allowNull : false
        },
        active : {
            type : Sequelize.INTEGER,
            allowNull : false
        },
        qty : {
            type : Sequelize.INTEGER,
            allowNull : false
        },
        market : {
            type : Sequelize.STRING,
            allowNull : false
        },
        description : {
            type : Sequelize.TEXT,
        },
        state : {
            type : Sequelize.STRING,
        },
        zip : {
            type : Sequelize.STRING,
        },
        country : {
            type : Sequelize.STRING,
        },
        address : {
            type : Sequelize.STRING,
        },
        amount : {
            type : Sequelize.STRING,
            allowNull : false
        },
        currency : {
            type : Sequelize.STRING,
            allowNull : false
        },
        po_expiry : {
            type : Sequelize.STRING,
        },
        d_method : {
            type : Sequelize.STRING,
        },
        d_date : {
            type : Sequelize.STRING,
        },
        d_window : {
            type : Sequelize.STRING,
        },
        video : {
            type : Sequelize.STRING,
        },
        packaging : {
            type : Sequelize.STRING,
        },
        application : {
            type : Sequelize.STRING,
        },
        is_negotiable : {
            type : Sequelize.STRING,
        },
        ...generateTimestamps(Sequelize,mode)
    }
}
const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("product_requests", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const ProductRequest = instance.define("product_requests", Schema(Sequelize,2),{ timestamps: false });
    return ProductRequest;
}

module.exports = { Schema , Model};