
/* ------------------------------- CONTROLLERS ------------------------------ */
/* ----------------------------------- --- ---------------------------------- */

const Controller = require("~controllers/Controller");

const AuthController = require('~controllers/AuthController');

const UserController = require('~controllers/UserController');

const CropController = require('~controllers/CropController');

const CategoryController = require('../controllers/CategoryController');

const SubCategoryController = require('../controllers/SubCategoryController');

const CropRequestController = require('../controllers/CropRequestController');

const CropSpecificationController = require('../controllers/CropSpecificationController');

const NegotiationController = require('../controllers/NegotiationController');

const InputController = require('~controllers/InputProductController');

const Cart = require('~controllers/CartController');

/* ------------------------------- VALIDATORS ------------------------------- */

const { RegisterMerchantCorporateValidator, LoginValidator, RegisterPartnerValidator, RegisterAgentValidator, SendVerificationValidator, ConfirmVerificationValidator, ResetPasswordValidator, VerifyResetTokenValidator } = require('./validators/AuthValidators');

const CategoryValidator = require('./validators/CategoryValidator');
const SubCategoryValidator = require('./validators/SubCategoryValidator');
const CropValidation = require('./validators/CropValidation');
const NegotiationValidator = require('./validators/NegotiationValidator');
const InputsValidator = require('./validators/InputsValidator');
const OrderValidators = require("./validators/OrderValidators");


/* -------------------------------- PROVIDERS ------------------------------- */

const RouteProvider = require('~providers/RouteProvider');
const OrderController = require("~controllers/OrderController");
const TransactionValidator = require("./validators/TransactionValidator");
const TransactionController = require("~controllers/TransactionController");
const ColorController = require("~controllers/ColorController");
const { Order } = require("~database/models");


const Router = RouteProvider.Router;

/* -------------------------------------------------------------------------- */
/*                              DASHBOARD ROUTES                              */
/* -------------------------------------------------------------------------- */

// Authentication Routes

Router.middleware(['isGuest']).group((router) => {

    router.post('/login', LoginValidator, AuthController.login);

    router.post('/register', RegisterMerchantCorporateValidator, AuthController.registerMerchantCorporate);

    router.post('/register/partner', RegisterPartnerValidator, AuthController.registerPartner);

    router.post('/register/agent', RegisterAgentValidator, AuthController.registerAgent);

    router.post('/register/verify', SendVerificationValidator, AuthController.sendVerificationCode);

    router.post('/register/confirm', ConfirmVerificationValidator, AuthController.verifyCode);

    router.post('/password/email', SendVerificationValidator, AuthController.sendResetEmail);

    router.post('/password/verify', VerifyResetTokenValidator, AuthController.verifyResetToken);

    router.post('/password/reset', ResetPasswordValidator, AuthController.resetPassword);

});

Router.group((router) => {
    router.post('/testpost', Controller.testPostData);
    router.post('/flutterwave/webhook', TransactionController.handleFlutterwaveWebhook);
});

// User routes
Router.middleware(['isAuthenticated']).group((router) => {

    router.get('/users', UserController.getAllUsers);

    router.get('/users/bytype/:type', UserController.getUsersByType);

    router.get('/users/:id', UserController.getUserById);

    router.get('/users/:id/orders', OrderController.getByBuyer);

    router.get('/users/:id/sales', OrderController.getBySeller);

    router.get('/users/:id/crops', CropController.getAllCropsByUser);

    router.get('/users/:id/inputs', InputController.getAllInputsByUser);

});


/* -------------------------------------------------------------------------- */
/*                         GENERAL ROUTES                         */
/* -------------------------------------------------------------------------- */

Router.group((router) => {

    /* -------------------------------- Category -------------------------------- */
    router.get('/category/:type/getall', CategoryController.getAllCategories);
    router.get('/category/:type/getall/:offset/:limit', CategoryController.getAllByLimit);
    router.get('/category/:id', CategoryController.getById);

    /* ------------------------------- SubCategory ------------------------------ */
    router.get('/subcategory/getall', SubCategoryController.getAllSubCategories);
    router.get('/subcategory/getbycategory/:categoryId', SubCategoryController.getByCategory);
    router.get('/subcategory/:id', SubCategoryController.getById);

    /* ------------------------------- Transaction ------------------------------ */
    router.post('/transaction/verify', TransactionValidator.verifyTransaction, TransactionController.verifyTransaction);

    /* ------------------------------- Color ------------------------------ */
    router.get('/color/getall', ColorController.getAllColors);
    router.get('/color/getbyid/:id', ColorController.getColorbyid);
    router.get('/color/params/:offset/:limit', ColorController.getColorbyparams);

})

/* -------------------------------------------------------------------------- */
/*                              CROP MARKETPLACE                              */
/* -------------------------------------------------------------------------- */

// Routes

// Router.middleware(['isAuthenticated']).group((router) => {
Router.group((router) => {

    // router.get();


    /* ------------------------------- Crop ------------------------------ */

    router.post('/crop/:type/add', CropValidation.addCropWantedValidator, CropController.add);
    router.get('/crop/getbycropwanted', CropController.getByCropWanted);
    router.get('/crop/getbycropauction', CropController.getByCropAuctions);
    router.get('/crop/getbycropoffer', CropController.getByCropOffer);
    router.get('/crop/getbyid/:id', CropController.getById);
    router.get('/crop/:type/:userid', CropController.getByTypeandUserID);
    router.post('/crop/:id/deactivate', CropController.deactivateCropById);
    router.post('/crop/:id/fulfil', OrderController.fulfilCropOffer);
    router.get('/crop/:id/bid', CropController.getCropBids);
    router.post('/crop/:id/bid', CropValidation.createAuctionBid, CropController.bidForCrop);


    // router.post('/crop/editbyid', CropValidation.addCropValidator, CropController.EditById);


    /* ------------------------------- Crop Specification ------------------------------ */
    router.post('/crop/cropspecification/add', CropValidation.addCropSpecificationValidator, CropSpecificationController.add);



    /* ------------------------------- Crop Request ------------------------------ */
    router.post('/crop/croprequest/add', CropValidation.addCropRequestValidator, CropRequestController.add);
    router.get('/crop/croprequest/getall', CropRequestController.getall);
    router.get('/crop/croprequest/getall/:offset/:limit', CropRequestController.getallbyLimit);
    router.post('/crop/croprequest/getbyid', CropRequestController.getbyid);
    router.post('/crop/croprequest/getbyproductid', CropRequestController.getbyproductid);
    router.post('/crop/croprequest/editbyid', CropRequestController.editbyid);



    /* ------------------------------- Negotiation ------------------------------ */
    router.post('/crop/negotiation/add', NegotiationValidator.addNegotiationValidator, NegotiationController.add);
    // router.post('/crop/negotiation/admin/add', NegotiationValidator.addNegotiationValidator, NegotiationController.addmsgbyadmin);
    router.get('/crop/:cropId/negotiation/getbyuserid/:userid', NegotiationController.getbyuserid);
    router.get('/crop/negotiation/:userid', NegotiationController.getListByUser);
    router.post('/crop/negotiation/sendoffer', NegotiationController.sendNegotiationOffer);
    router.post('/crop/negotiation/accept', NegotiationValidator.negotiation, NegotiationController.acceptNegotiation);
    router.post('/crop/negotiation/decline', NegotiationValidator.negotiation, NegotiationController.declineNegotiation);
    router.post('/crop/negotiation/close', NegotiationValidator.negotiation, NegotiationController.closeNegotiation);
    router.get('/crop/negotiation/grabtransactionby/:status/:userid', NegotiationController.getNegotiationTransactionSummary);
    router.get('/crop/negotiation/getallsummary', NegotiationController.getAllNegotiationTransactionSummary);


    /* ---------------------------------- Order --------------------------------- */
    router.post('/crop/order/add', OrderValidators.createOrderValidator, OrderController.createNewOrder);
    router.post('/order/cart/create', OrderValidators.createCartOrderValidator, OrderController.createCartOrder);
    router.get('/order/:order', OrderController.getByOrderHash);
    router.get('/order/getbybuyer/:buyerid/:buyertype', OrderController.getByBuyer);
    router.get('/order/getbyseller/:sellerid/:buyertype', OrderController.getByBuyer);
    router.get('/order/getbynegotiationid/:negotiationid', OrderController.getByNegotiationId);
    router.get('/order/getbypaymentstatus/:paymentstatus', OrderController.getByPaymentStatus);
    // Tracking Details
    router.post('/order/:order/trackingdetails', OrderController.updateTrackingDetailsByOrderId);
    // Waybill Details
    router.post('/order/:order/waybilldetails', OrderValidators.updateWaybillDetailsValidators, OrderController.updateWaybillDetailsByOrderId);
    // Goodreceiptnote Details
    router.post('/order/:order/goodsreceiptnote', OrderValidators.updateGoodReceiptDetailsValidators, OrderController.updateGoodReceiptNoteByOrderId);

    router.post('/order/:order/delivery', OrderValidators.orderDeliveryValidator, OrderController.saveDeliveryDetails);


    /* ---------------------------------- Transaction --------------------------------- */
    router.post('/crop/transaction/add', TransactionValidator.addTransactionValidator, TransactionController.createNewTransaction);
});


/* -------------------------------------------------------------------------- */
/*                             INPUT MARKET PLACE                             */
/* -------------------------------------------------------------------------- */



/* -------------------------------------------------------------------------- */
/*                             INPUT MARKET PLACE                             */
/* -------------------------------------------------------------------------- */

// Router.middleware('isAuthenticated').group((router) => {
Router.group((router) => {
    /* ---------------------------------- Input ---------------------------------- */
    router.post('/input/add', InputsValidator.createInputValidator, InputController.createInput);
    router.get('/input/getallbyuserid/:user_id', InputController.getAllInputsByUser);
    router.get('/input', InputController.getallInputs);
    router.delete('/input/:id', InputController.deleteInputById);
    router.post('/input/:id/deactivate', InputController.deactivateInputById);
    router.get('/input/:input', InputController.getInputById);
    router.get('/input/getallbycategory/:category', InputController.getallInputsByCategory);
    router.get('/input/getallbymanufacturer/:manufacturer', InputController.getallInputsByManufacturer);
    router.get('/input/getallbypackaging/:packaging', InputController.getallInputsByPackaging);


    /* ---------------------------------- CART ---------------------------------- */
    router.post('/input/cart/add', InputsValidator.addToCartValidator, Cart.addtoCart);
    router.get('/input/cart/:user_id', Cart.getUserInputCart);
    router.delete('/input/cart/delete/:id', Cart.deleteCartItem);


    /* ---------------------------------- Order --------------------------------- */
    router.post('/input/order/add', OrderValidators.InputOrderValidator, OrderController.createInputOrder);
    router.post('/input/order/updateinputorder', OrderValidators.updateOrderValidator, OrderController.updateOrderPayment);
    router.get('/input/order/history/getbyuserid/:user_id', OrderController.getOrderHistoryByUserId);
})

module.exports = Router;


