let Schema = (Sequelize) => {
    return {
        user_id : {
            type: Sequelize.INTEGER,
            allowNull : false
        },
        client_id : {
            type : Sequelize.INTEGER,
            allowNull : false
        },
        token : {
            type: Sequelize.STRING,
            unique : true,
            allowNull : false
        },
        expires_at : {
            type: Sequelize.DATE,
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
    const AccessTokens = sequelize.define("access_tokens", Schema(Sequelize),{ timestamps: false });
    return AccessTokens;
}

module.exports = { Schema , Model};