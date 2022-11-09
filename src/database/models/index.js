
const Sequelize = require("sequelize");

require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
  host: process.env.DATABASE_HOST,
  dialect: process.env.DATABASE_DIALECT,
  operatorsAliases: false,

  pool: {
    max: eval(process.env.DATABASE_POOL_MAX),
    min: eval(process.env.DATABASE_POOL_MIN),
    acquire: eval(process.env.DATABASE_POOL_ACQUIRE),
    idle: eval(process.env.DATABASE_POOL_IDLE)
  }
});

const DB = {};

DB.Sequelize = Sequelize;
DB.sequelize = sequelize;


//Register Sequelize Models
DB.users = require("./user.model.js").Model(sequelize, Sequelize);
DB.merchants = require("./merchant.model.js").Model(sequelize, Sequelize);
DB.buyers = require("./buyer.model.js").Model(sequelize, Sequelize);
DB.agents = require("./agent.model.js").Model(sequelize, Sequelize);
DB.companies = require("./company.model.js").Model(sequelize, Sequelize);
DB.partners = require("./partner.model.js").Model(sequelize, Sequelize);
DB.accessTokens = require("./access_token.model.js").Model(sequelize, Sequelize);

module.exports = DB;