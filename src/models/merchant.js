const Base = require("./base");
const Schema = require('~database/models/merchant.model').Schema;
const Sequelize = require("sequelize");
const User = require('./user');

class Merchant extends Base {
    constructor(input){
        const table = 'merchants';
        const attributes = Object.keys(Schema(Sequelize));
        const relationships = {
            "user" : { model : User() , key : "user_id" } 
        };
        const appends = {
            user_type : "merchant"
        };
        super();
        return this._boot(table, attributes, relationships,appends, input);
    }
}

module.exports = (args)=>{
    let instance = (new Merchant(args));
    return instance;
};