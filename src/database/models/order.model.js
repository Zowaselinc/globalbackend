let Schema = (Sequelize) => {
    return {
        order_id : {
            type: Sequelize.STRING,
            allowNull : false
        },
        amount : {
            type : Sequelize.STRING,
            allowNull : false
        },
        total_product : {
            type: Sequelize.STRING,
            allowNull : false
        },
        action : {
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
    const Order = sequelize.define("orders", Schema(Sequelize),{ timestamps: false });
    return Order;
}

module.exports = { Schema , Model};