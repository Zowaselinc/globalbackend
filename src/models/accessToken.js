const Base = require("./base");
const Schema = require('~database/models/access_token.model').Schema;
const Sequelize = require("sequelize");

class AccessToken extends Base {
    constructor(input){
        const table = 'access_tokens';
        const attributes = Object.keys(Schema(Sequelize));
        super();
        return this._boot(table, attributes, input);
    }
}

module.exports = (args)=>{
    let instance = (new AccessToken(args));
    return instance;
};