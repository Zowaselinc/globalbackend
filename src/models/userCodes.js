const Base = require("./base");
const Schema = require('~database/models/user_codes.model').Schema;
const Sequelize = require("sequelize");

class UserCode extends Base {
    constructor(input){
        const table = 'user_codes';
        const attributes = Object.keys(Schema(Sequelize));
        const relationships = {};
        const appends = {};
        super();
        return this._boot(table, attributes, relationships,appends, input);
    }
}

module.exports = (args)=>{
    let instance = (new UserCode(args));
    return instance;
};