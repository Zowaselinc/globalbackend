const Base = require("./base");
const Schema = require('~database/models/order.model').Schema;
const Sequelize = require("sequelize");

class Order extends Base {
    constructor(input){
        const table = 'orders';
        const attributes = Object.keys(Schema(Sequelize));
        super();
        return this._boot(table, attributes, input);
    }
}

module.exports = (args)=>{
    let instance = (new Order(args));
    return instance;
};