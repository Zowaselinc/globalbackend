let Schema = (Sequelize) => {
    return {
        email : {
            type: Sequelize.STRING,
            unique : false,
            allowNull : false
        },
        type : {
            type: Sequelize.STRING,
            unique : false,
            allowNull : false
        },
        code : {
            type: Sequelize.STRING,
            unique : false,
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
    const UserCodes = sequelize.define("user_codes", Schema(Sequelize),{ timestamps: false });
    return UserCodes;
}

module.exports = { Schema , Model};