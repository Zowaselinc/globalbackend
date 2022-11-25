const Base = require("./base");
const Schema = require('~database/models/pricing.model').Schema;
const Sequelize = require("sequelize");

class Pricing extends Base {
    constructor(input){
        const table = 'pricings';
        const attributes = Object.keys(Schema(Sequelize));
        super();
        return this._boot(table, attributes, input);
    }
}

module.exports = (args)=>{
    let instance = (new Pricing(args));
    return instance;
};