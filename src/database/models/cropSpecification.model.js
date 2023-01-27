const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {

    return {
        model_id : {
            type: Sequelize.INTEGER(11),
            allowNull : false
        },
        model_type : {
            type: Sequelize.STRING,
            allowNull : false
        },  
        qty : {
            type: Sequelize.INTEGER(11),
            allowNull : false
        },
        price : {
            type: Sequelize.STRING,
            allowNull : false
        },
        color : {
            type: Sequelize.STRING,
            allowNull : false
        },
        moisture : {
            type: Sequelize.STRING,
            allowNull : false
        },
        foreign_matter : {
            type: Sequelize.STRING,
            allowNull : false
        },
        broken_grains : {
            type: Sequelize.STRING,
            allowNull : false
        },
        weevil : {
            type: Sequelize.STRING,
            allowNull : false
        },
        dk : {
            type: Sequelize.STRING,
            allowNull : false
        },
        rotten_shriveled : {
            type: Sequelize.STRING,
            allowNull : false
        },
        test_weight: {
            type: Sequelize.STRING,
            allowNull : false
        },
        hectoliter : {
            type: Sequelize.STRING,
            allowNull : false
        },
        hardness : {
            type: Sequelize.STRING,
            allowNull : false
        },
        splits : {
            type: Sequelize.STRING,
            allowNull : false
        },
        oil_content : {
            type: Sequelize.STRING,
            allowNull : false
        },
        infestation : {
            type: Sequelize.STRING,
            allowNull : false
        },
        grain_size : {
            type: Sequelize.STRING,
            allowNull : false
        },
        total_defects : {
            type: Sequelize.STRING,
            allowNull : false
        },
        dockage : {
            type: Sequelize.STRING,
            allowNull : false
        },
        ash_content : {
            type: Sequelize.STRING,
            allowNull : false
        },
        acid_ash : {
            type: Sequelize.STRING,
            allowNull : false
        },
        volatile : {
            type: Sequelize.STRING,
            allowNull : false
        },
        mold : {
            type: Sequelize.STRING,
            allowNull : false
        },
        drying_process : {
            type: Sequelize.STRING,
            allowNull : false
        },
        dead_insect : {
            type: Sequelize.STRING,
            allowNull : false
        },
        mammalian : {
            type: Sequelize.STRING,
            allowNull : false
        },
        infested_by_weight : {
            type: Sequelize.STRING,
            allowNull : false
        },
        curcumin_content : {
            type: Sequelize.STRING,
            allowNull : false
        },
        extraneous : {
            type: Sequelize.STRING,
            allowNull : false
        },
        ...generateTimestamps(Sequelize,mode)
    }
}

const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("crop_specification", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const CropSpecification = instance.define("crop_specification", Schema(Sequelize,2),{ 
        timestamps: false,
    });
    return CropSpecification;
}

module.exports = { Schema , Model};