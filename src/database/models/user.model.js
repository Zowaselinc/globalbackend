let Schema = (Sequelize) => {
    return {
        first_name : {
            type: Sequelize.STRING
        },
        last_name : {
            type: Sequelize.STRING
        },
        phone : {
            type: Sequelize.STRING,
            allowNull : false
        },
        email : {
            type : Sequelize.STRING,
            allowNull : false,
            unique : true
        },
        password : {
            type : Sequelize.STRING,
            allowNull : false
        },
        status : {
            type : Sequelize.BOOLEAN
        },
        is_verified : {
            type : Sequelize.BOOLEAN
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
    const User = sequelize.define("users", Schema(Sequelize),{ timestamps: false });
    return User;
}

module.exports = { Schema , Model};