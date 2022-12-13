
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
const AccessToken = DB.accessTokens = require("./accessToken.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const UserCode = DB.userCodes = require("./userCodes.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Pricing = DB.pricings = require("./pricing.model").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Transaction = DB.transactions = require("./transaction.model").Model(initialInstance, createSequelizeInstance(), Sequelize);
const CropSpecification = DB.cropSpecifications = require("./cropSpecification.model").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Crop = DB.crops = require("./crop.model").Model(initialInstance, createSequelizeInstance(), Sequelize);
const CropRequest = DB.cropRequests = require("./cropRequest.model").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Auction = DB.auctions = require("./auction.model").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Order = DB.orders = require("./order.model").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Wallet= DB.wallets = require("./wallet.model").Model(initialInstance, createSequelizeInstance(), Sequelize);
const MerchantType = DB.merchantTypes = require("./merchantType.model").Model(initialInstance, createSequelizeInstance(), Sequelize);
const BankAccount = DB.bankAccount = require("./bankAccount.model").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Category = DB.categories = require("./category.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const SubCategory = DB.subcategories = require("./subcategory.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const ErrorLog = DB.errorlogs = require("./errorLog.model").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Negotiation = DB.negotiation = require("./negotiation.model").Model(initialInstance, createSequelizeInstance(), Sequelize);
<<<<<<< HEAD
const Cart = DB.cart = require("./cart.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Input = DB.input = require("./input.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
=======
const InputCart = DB.input_cart = require("./inputCart.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const Input = DB.input = require("./input.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const DeliveryAddress = DB.delivery_address = require("./deliveryAddress.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
const InputOrder = DB.input_order = require("./inputOrder.model.js").Model(initialInstance, createSequelizeInstance(), Sequelize);
>>>>>>> 17179f2aa4016078234ac0a749c499e7e6f4e8dd

//---------------------------------------------------
//Register Relationships
//---------------------------------------------------

Merchant.belongsTo(User , { foreignKey : "user_id"});

Corporate.belongsTo(User , { foreignKey : "user_id"});

Agent.belongsTo(User , { foreignKey : "user_id"});

Partner.belongsTo(User , { foreignKey : "user_id"});



/* ---------------------------------- CROP ---------------------------------- */
// 1
Crop.hasMany(CropSpecification,{
  foreignKey: 'model_id',
  as: 'crop_specification'
})

CropSpecification.belongsTo(Crop,{
  foreignKey: 'model_id',
  as: 'crop'
});

Crop.hasMany(CropRequest,{
  foreignKey: 'crop_id',
  as: 'crop_request'
})

CropRequest.belongsTo(Crop,{
  foreignKey: 'crop_id',
  as: 'crop'
});



// 2
Negotiation.hasMany(CropSpecification,{
  foreignKey: 'model_id',
  as: 'crop_specification'
})




Category.hasMany(Crop ,{
  foreignKey : "category",
});

Category.hasMany(Input ,{
  foreignKey : "category",
});

SubCategory.hasMany(Input,{
  foreignKey : "sub_category",
});

SubCategory.hasMany(Crop,{
  foreignKey : "sub_category",
});

<<<<<<< HEAD
Cart.hasOne(Input,{ foreignKey: 'id' })

Input.hasMany(Cart,{
=======
InputCart.hasOne(Input,{ foreignKey: 'id' })

Input.hasMany(InputCart,{
>>>>>>> 17179f2aa4016078234ac0a749c499e7e6f4e8dd
  foreignKey: 'input_id',
  as: 'input_cart'
})

<<<<<<< HEAD
=======
InputOrder.hasMany(Input, { foreignKey: 'id' })
InputOrder.hasOne(DeliveryAddress, {foreignKey: 'id'})

>>>>>>> 17179f2aa4016078234ac0a749c499e7e6f4e8dd
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
  Crop,
  CropSpecification,
  CropRequest,
  Order,
  Wallet,
  MerchantType,
  BankAccount,
  Auction,
  Category,
  SubCategory,
  ErrorLog,
  Negotiation,
<<<<<<< HEAD
  Cart,
  Input
=======
  InputCart,
  Input,
  DeliveryAddress,
  InputOrder
>>>>>>> 17179f2aa4016078234ac0a749c499e7e6f4e8dd
};