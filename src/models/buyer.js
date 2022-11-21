const Base = require("./base");
const Schema = require('~database/models/buyer.model').Schema;
const Sequelize = require("sequelize");
const User = require('./user');

class Buyer extends Base {
    constructor(input){
        const table = 'buyers';
        const attributes = Object.keys(Schema(Sequelize));
        const relationships = {
            "user" : { model : User() , key : "user_id" } 
        };
        const appends = {
            user_type : "buyer"
        };
        super();
        return this._boot(table, attributes, relationships,appends, input);
    }
}

module.exports = (args)=>{
    let instance = (new Buyer(args));
    return instance;
};