let Schema = (Sequelize) => {
    return {
        transaction_id : {
            type: Sequelize.STRING,
            allowNull : false
        },
        amount : {
            type : Sequelize.STRING,
            allowNull : false
        },
        method : {
            type: Sequelize.STRING,
            allowNull : false
        },
        type : {
            type: Sequelize.STRING,
            allowNull : false
        },
        status : {
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
    const Transaction = sequelize.define("transactions", Schema(Sequelize),{ timestamps: false });
    return Transaction;
}

module.exports = { Schema , Model};