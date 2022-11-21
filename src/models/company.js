const Base = require("./base");
const Schema = require('~database/models/company.model').Schema;
const Sequelize = require("sequelize");
const User = require('./user');

class Company extends Base {
    constructor(input){
        const table = 'companies';
        const attributes = Object.keys(Schema(Sequelize));
        const relationships = {
            "user" : { model : User() , key : "user_id" } 
        };
        const appends = {};
        super();
        return this._boot(table, attributes, relationships,appends, input);
    }
}

module.exports = (args)=>{
    let instance = (new Company(args));
    return instance;
};