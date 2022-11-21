const Base = require("./base");
const UserSchema = require('~database/models/user.model').Schema;
const Sequelize = require("sequelize");

class User extends Base {
    constructor(input){
        const table = 'users';
        const attributes = Object.keys(UserSchema(Sequelize));
        const relationships = {};
        const appends = {};
        super();
        return this._boot(table, attributes, relationships,appends, input);
    }
}

module.exports = (args)=>{
    let instance = (new User(args));
    return instance;
};