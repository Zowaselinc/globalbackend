const Base = require("./base");
const Schema = require('~database/models/company.model').Schema;
const Sequelize = require("sequelize");

class Company extends Base {
    constructor(input){
        const table = 'companies';
        const attributes = Object.keys(Schema(Sequelize));
        super();
        return this._boot(table, attributes, input);
    }
}

module.exports = (args)=>{
    let instance = (new Company(args));
    return instance;
};