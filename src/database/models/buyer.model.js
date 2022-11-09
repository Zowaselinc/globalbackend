let Schema = (Sequelize) => {
    return {
        user_id : {
            type: Sequelize.INTEGER,
            unique : true,
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
    const Buyer = sequelize.define("buyers", Schema(Sequelize),{ timestamps: false });
    return Buyer;
}

module.exports = { Schema , Model};