const Base = require("./base");
const Schema = require('~database/models/partner.model').Schema;
const Sequelize = require("sequelize");

class Partner extends Base {
    constructor(input){
        const table = 'partners';
        const attributes = Object.keys(Schema(Sequelize));
        super();
        return this._boot(table, attributes, input);
    }
}

module.exports = (args)=>{
    let instance = (new Partner(args));
    return instance;
};