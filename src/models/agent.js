const Base = require("./base");
const Schema = require('~database/models/agent.model').Schema;
const Sequelize = require("sequelize");

class Agent extends Base {
    constructor(input){
        const table = 'agents';
        const attributes = Object.keys(Schema(Sequelize));
        super();
        return this._boot(table, attributes, input);
    }
}

module.exports = (args)=>{
    let instance = (new Agent(args));
    return instance;
};