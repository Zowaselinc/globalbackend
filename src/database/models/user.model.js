const generateTimestamps = require("./timestamps");

let Schema = (Sequelize,mode) => {
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
        type : {
            type : Sequelize.STRING,
            allowNull : false
        },
        account_type : {
            type : Sequelize.STRING,
            allowNull : false
        },
        primary_address : {
            type : Sequelize.STRING,
        },
        secondary_address : {
            type : Sequelize.STRING,
        },
        gender : {
            type : Sequelize.STRING,
        },
        city : {
            type : Sequelize.STRING,
        },
        state : {
            type : Sequelize.STRING,
        },
        country : {
            type : Sequelize.STRING,
        },
        zip_code : {
            type : Sequelize.STRING,
        },
        url : {
            type : Sequelize.STRING,
        },
        image : {
            type : Sequelize.STRING,
        },
        reg_level : {
            type : Sequelize.INTEGER,
        },
        active : {
            type : Sequelize.INTEGER
        },
        status : {
            type : Sequelize.INTEGER
        },
        is_verified : {
            type : Sequelize.INTEGER
        },
        is_approved : {
            type : Sequelize.INTEGER
        },
        ...generateTimestamps(Sequelize,mode)
    }
}
const Model = (sequelize, instance, Sequelize) => {
    // Define initial for DB sync
    sequelize.define("users", Schema(Sequelize,1),{ timestamps: false });
    // Bypass initial instance to cater for timestamps
    const User = instance.define("users", Schema(Sequelize,2),{ 
        timestamps: false,
        scopes: {
            hidden: {
              attributes: { exclude: ['password'] },
            }
        }
    });
    return User;
}

module.exports = { Schema , Model};