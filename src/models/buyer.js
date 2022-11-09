const Base = require("./base");
const Schema = require('~database/models/buyer.model').Schema;
const Sequelize = require("sequelize");

class Buyer extends Base {
    constructor(input){
        const table = 'buyers';
        const attributes = Object.keys(Schema(Sequelize));
        super();
        return this._boot(table, attributes, input);
    }
}

module.exports = (args)=>{
    let instance = (new Buyer(args));
    return instance;
};