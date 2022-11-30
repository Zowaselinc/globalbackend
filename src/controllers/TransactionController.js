
const jwt = require("jsonwebtoken");
const { Pricing, Transaction } = require("~database/models");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const Mailer = require('~services/mailer');
const { buyers } = require("~database/models");
const md5  = require('md5');
const { reset } = require("nodemon");
const { use } = require("~routes/api");



class TransactionController{


}

module.exports = TransactionController;