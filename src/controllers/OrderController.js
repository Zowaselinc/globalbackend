
const jwt = require("jsonwebtoken");
const { Pricing, Transaction, Order} = require("~database/models");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const Mailer = require('~services/mailer');
const md5  = require('md5');
const { reset } = require("nodemon");
const { use } = require("~routes/api");



class OrderController{


}

module.exports = OrderController;