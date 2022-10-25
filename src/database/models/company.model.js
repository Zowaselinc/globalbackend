let Schema = (Sequelize) => {
    return {
        user_id : {
            type: Sequelize.INTEGER,
            unique : true,
            allowNull : false
        },
        company_name : {
            type: Sequelize.STRING,
            allowNull : false
        },
        company_address : {
            type: Sequelize.STRING
        },
        company_email : {
            type: Sequelize.STRING,
            allowNull : false,
            unique : true
        },
        company_phone : {
            type: Sequelize.STRING,
            allowNull : false
        },
        state : {
            type: Sequelize.STRING,
            allowNull : false
        },
        rc_number : {
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
    const Company = sequelize.define("companies", Schema(Sequelize),{ timestamps: false });
    return Company;
}

module.exports = { Schema , Model};