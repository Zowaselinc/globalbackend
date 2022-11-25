let Schema = (Sequelize) => {
    return {
        user_id : {
            type: Sequelize.STRING,
            allowNull : false
        },
        client_id : {
            type : Sequelize.STRING,
            allowNull : false
        },
        package : {
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
    const Pricing = sequelize.define("pricings", Schema(Sequelize),{ timestamps: false });
    return Pricing;
}

module.exports = { Schema , Model};