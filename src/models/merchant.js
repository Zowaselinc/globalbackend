const Base = require("./base");
const Schema = require('~database/models/merchant.model').Schema;
const Sequelize = require("sequelize");

class Merchant extends Base {
    constructor(input){
        const table = 'merchants';
        const attributes = Object.keys(Schema(Sequelize));
        super();
        return this._boot(table, attributes, input);
    }
}

module.exports = (args)=>{
    let instance = (new Merchant(args));
    return instance;
};