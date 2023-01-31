const generateTimestamps = require("./timestamps");

let Schema = (Sequelize, mode) => {

    return {
        user_id: {
            type: Sequelize.INTEGER(11),
            allowNull: false
        },
        category_id: {
            type: Sequelize.STRING,
            allowNull: false
        },
        subcategory_id: {
            type: Sequelize.STRING,
            allowNull: false
        },
        // product_type: {
        //     type: Sequelize.STRING,
        //     allowNull: false
        // },
        // added
        title : {
            type : Sequelize.STRING,
            allowNull : false
        },
        kg: {
            type: Sequelize.STRING,
            allowNull: false
        },
        state : {
            type: Sequelize.STRING,
            allowNull : false
        },
        // added
        crop_focus: {
            type: Sequelize.STRING(350),
            allowNull: false
        },
        packaging: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        stock: {
            type: Sequelize.STRING,
            allowNull: false
        },
        usage_instruction: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        // kilograms: {
        //     type: Sequelize.STRING,
        //     allowNull: false
        // },
        grams: {
            type: Sequelize.STRING,
        },
        liters: {
            type: Sequelize.STRING,
            allowNull: false
        },
        pieces_carton: {
            type: Sequelize.STRING,
        },
        images: {
            type: Sequelize.STRING(350)
        },
        price: {
            type: Sequelize.INTEGER(11),
            allowNull: false
        },
        currency: {
            type: Sequelize.STRING,
            allowNull: false
        },
        manufacture_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        manufacture_date: {
            type: Sequelize.STRING,
            allowNull: false
        },
        delivery_method: {
            type: Sequelize.STRING,
            allowNull: false
        },
        expiry_date: {
            type: Sequelize.STRING,
            allowNull: false
        },
        manufacture_country: {
            type: Sequelize.STRING,
            allowNull: false
        },
        video: {
            type: Sequelize.STRING,
        },
        ...generateTimestamps(Sequelize, mode)
    }
}

const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("inputs", Schema(Sequelize, 1), { timestamps: false });
    // Bypass initial instance to cater for timestamps
    const Inputs = instance.define("inputs", Schema(Sequelize, 2), {
        timestamps: false,
    });
    return Inputs;
}

module.exports = { Schema, Model };