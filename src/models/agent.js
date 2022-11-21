const Base = require("./base");
const Schema = require('~database/models/agent.model').Schema;
const Sequelize = require("sequelize");
const User = require('./user');

class Agent extends Base {
    constructor(input){
        const table = 'agents';
        const attributes = Object.keys(Schema(Sequelize));
        const relationships = {
            "user" : { model : User() , key : "user_id" } 
        };
        const appends = {
            user_type : "agent"
        };
        super();
        return this._boot(table, attributes, relationships,appends, input);
    }
}

module.exports = (args)=>{
    let instance = (new Agent(args));
    return instance;
};