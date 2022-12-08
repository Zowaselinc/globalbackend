
const Sequelize = require("sequelize");

require('dotenv').config();
const createSequelizeInstance = () => {
  const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect: process.env.DATABASE_DIALECT,
    operatorsAliases: false,
    port : process.env.DATABASE_PORT ?? 3306,
  
    pool: {
      max: eval(process.env.DATABASE_POOL_MAX),
      min: eval(process.env.DATABASE_POOL_MIN),
      acquire: eval(process.env.DATABASE_POOL_ACQUIRE),
      idle: eval(process.env.DATABASE_POOL_IDLE)
    }
  });

  return sequelize;
}


const DB = {};

const initialInstance = createSequelizeInstance();

DB.Sequelize = Sequelize;
DB.sequelize = initialInstance;


//Register Sequelize Models
const User = DB.users = require("./user.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Merchant = DB.merchants = require("./merchant.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Corporate = DB.corporate = require("./corporate.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Agent = DB.agents = require("./agent.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Company = DB.companies = require("./company.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Partner = DB.partners = require("./partner.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const AccessToken = DB.accessTokens = require("./access_token.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const UserCode = DB.userCodes = require("./user_codes.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Pricing = DB.pricings = require("./pricing.model").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Transaction = DB.transactions = require("./transaction.model").Model(initialInstance, createSequelizeInstance(), Sequelize);
const ProductSpecification = DB.productSpecifications = require("./product_specification.model").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Product = DB.products = require("./product.model").Model(initialInstance, createSequelizeInstance(), Sequelize);
const ProductRequest = DB.productRequests = require("./product_request.model").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Auction = DB.auctions = require("./auction.model").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Order = DB.orders = require("./order.model").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Wallet= DB.wallets = require("./wallet.model").Model(initialInstance, createSequelizeInstance(), Sequelize);
const MerchantType = DB.merchantTypes = require("./merchant_type.model").Model(initialInstance, createSequelizeInstance(), Sequelize);
const BankAccount = DB.bankAccount = require("./bank_account.model").Model(initialInstance, createSequelizeInstance(), Sequelize);
const NegotiationOffer = DB.negotiationOffer = require('./negotiation.model').Model(initialInstance, createSequelizeInstance(), Sequelize);


//Register Relationships
Merchant.belongsTo(User , { foreignKey : "user_id"});
Corporate.belongsTo(User , { foreignKey : "user_id"});
Agent.belongsTo(User , { foreignKey : "user_id"});
Partner.belongsTo(User , { foreignKey : "user_id"});


module.exports = {
  DB,
  User,
  Company,
  Merchant,
  Corporate,
  Agent,
  Partner,
  AccessToken,
  UserCode,
  Pricing,
  Transaction,
  ProductSpecification,
  Order,
  Product,
  ProductRequest,
  Wallet,
  MerchantType,
  BankAccount,
  Auction,
  NegotiationOffer
};