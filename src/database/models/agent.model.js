let Schema = (Sequelize) => {
    return {
        user_id : {
            type: Sequelize.INTEGER,
            unique : true,
            allowNull : false
        },
        agent_type : {
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
    const Agent = sequelize.define("agents", Schema(Sequelize),{ timestamps: false });
    return Agent;
}

module.exports = { Schema , Model};