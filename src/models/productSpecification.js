const Base = require("./base");
const Schema = require('~database/models/product_specification.model').Schema;
const Sequelize = require("sequelize");

class ProductSpecification extends Base {
    constructor(input){
        const table = 'product_specifications';
        const attributes = Object.keys(Schema(Sequelize));
        super();
        return this._boot(table, attributes, input);
    }
}

module.exports = (args)=>{
    let instance = (new ProductSpecification(args));
    return instance;
};