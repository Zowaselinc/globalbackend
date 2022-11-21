const Base = require("./base");
const Schema = require('~database/models/access_token.model').Schema;
const Sequelize = require("sequelize");

class AccessToken extends Base {
    constructor(input){
        const table = 'access_tokens';
        const attributes = Object.keys(Schema(Sequelize));
        const relationships = {};
        super();
        const appends = {};
        return this._boot(table, attributes, relationships,appends, input);
    }
}

module.exports = (args)=>{
    let instance = (new AccessToken(args));
    return instance;
};