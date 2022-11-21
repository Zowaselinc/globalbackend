const Base = require("./base");
const Schema = require('~database/models/partner.model').Schema;
const Sequelize = require("sequelize");
const User = require('./user');

class Partner extends Base {
    constructor(input){
        const table = 'partners';
        const attributes = Object.keys(Schema(Sequelize));
        const relationships = {
            "user" : { model : User() , key : "user_id" } 
        };
        const appends = {
            user_type : "partner"
        };
        super();
        return this._boot(table, attributes, relationships,appends, input);
    }
}

module.exports = (args)=>{
    let instance = (new Partner(args));
    return instance;
};