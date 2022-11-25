let Schema = (Sequelize) => {
    return {
        category : {
            type: Sequelize.STRING,
            allowNull : false
        },
        sub_category : {
            type: Sequelize.STRING,
            allowNull : false
        },
        color : {
            type : Sequelize.STRING,
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
        weeevil : {
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
        test_weight : {
            type: Sequelize.STRING,
            allowNull : false
        },   
        hectolitter : {
            type: Sequelize.STRING,
            allowNull : false
        },   
        hardness : {
            type: Sequelize.STRING,
            allowNull : false
        },   
        splits: {
            type: Sequelize.STRING,
            allowNull : false
        },
        oil_content: {
            type: Sequelize.STRING,
            allowNull : false
        },
        infestation: {
            type: Sequelize.STRING,
            allowNull : false
        },
        grian_size: {
            type: Sequelize.STRING,
            allowNull : false
        }, 
        total_defects: {
            type: Sequelize.STRING,
            allowNull : false
        },
        dockage: {
            type: Sequelize.STRING,
            allowNull : false
        }, 
        ash_content: {
            type: Sequelize.STRING,
            allowNull : false
        },
        acid_ash: {
            type: Sequelize.STRING,
            allowNull : false
        }, 
        volatile: {
            type: Sequelize.STRING,
            allowNull : false
        },  
        mold: {
            type: Sequelize.STRING,
            allowNull : false
        }, 
        drying_process: {
            type: Sequelize.STRING,
            allowNull : false
        },
        dead_insect: {
            type: Sequelize.STRING,
            allowNull : false
        }, 
        mammalian: {
            type: Sequelize.STRING,
            allowNull : false
        },
        infested_by_weight: {
            type: Sequelize.STRING,
            allowNull : false
        }, 
        curcumin_content: {
            type: Sequelize.STRING,
            allowNull : false
        },
        extraneous: {
            type: Sequelize.STRING,
            allowNull : false
        },
        kg: {
            type: Sequelize.STRING,
            allowNull : false
        }, 
        liters: {
            type: Sequelize.STRING,
            allowNull : false
        },                      

        created_at: {
            type: 'TIMESTAMP',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
            type: 'TIMESTAMP',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        },
    }
}
const Model = (sequelize, Sequelize) => {
    const spec = sequelize.define("product_specifications", Schema(Sequelize),{ timestamps: false });
    return spec;
}

module.exports = { Schema , Model};