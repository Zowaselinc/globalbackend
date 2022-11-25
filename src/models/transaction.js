const Base = require("./base");
const Schema = require('~database/models/transaction.model').Schema;
const Sequelize = require("sequelize");

class Transaction extends Base {
    constructor(input){
        const table = 'transactions';
        const attributes = Object.keys(Schema(Sequelize));
        super();
        return this._boot(table, attributes, input);
    }
}

module.exports = (args)=>{
    let instance = (new Transaction(args));
    return instance;
};