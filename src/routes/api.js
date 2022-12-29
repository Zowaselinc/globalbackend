
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
const Input = require('~controllers/InputProductController');

const Cart = require('~controllers/CartController');

/* ------------------------------- VALIDATORS ------------------------------- */

const { RegisterMerchantCorporateValidator, LoginValidator, RegisterPartnerValidator, RegisterAgentValidator, SendVerificationValidator, ConfirmVerificationValidator, ResetPasswordValidator, VerifyResetTokenValidator} = require('./validators/AuthValidators');

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


const Router = RouteProvider.Router;

/* -------------------------------------------------------------------------- */
/*                              DASHBOARD ROUTES                              */
/* -------------------------------------------------------------------------- */

// Authentication Routes

Router.middleware(['isGuest']).group((router)=>{

    router.post('/login',LoginValidator,AuthController.login);

    router.post('/register',RegisterMerchantCorporateValidator,AuthController.registerMerchantCorporate);

    router.post('/register/partner',RegisterPartnerValidator,AuthController.registerPartner);

    router.post('/register/agent',RegisterAgentValidator,AuthController.registerAgent);

    router.post('/register/verify',SendVerificationValidator,AuthController.sendVerificationCode);

    router.post('/register/confirm',ConfirmVerificationValidator,AuthController.verifyCode);

    router.post('/password/email',SendVerificationValidator,AuthController.sendResetEmail);

    router.post('/password/verify',VerifyResetTokenValidator,AuthController.verifyResetToken);

    router.post('/password/reset',ResetPasswordValidator,AuthController.resetPassword);

});

// User routes
Router.middleware(['isAuthenticated']).group((router)=>{

    router.get('/users', UserController.getAllUsers);

    router.get('/users/bytype/:type', UserController.getUsersByType);

    router.get('/users/:id', UserController.getUserById);

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

        router.get('/subcategory/getbycategory/:categoryId', SubCategoryController.getByCategory);
        router.get('/subcategory/:id', SubCategoryController.getById);

        /* ------------------------------- Transaction ------------------------------ */

    router.post('/transaction/verify', TransactionValidator.verifyTransaction, TransactionController.verifyTransaction );

})

/* -------------------------------------------------------------------------- */
/*                              CROP MARKETPLACE                              */
/* -------------------------------------------------------------------------- */

// Routes
/***************
 * TEST ROUTES *
 ***************/
Router.get("/crop/hello", Controller.hello);
Router.get("/crop/category/hello", CategoryController.hello);
Router.get("/crop/subcategory/hello", SubCategoryController.hello);
Router.get("/crop/product/hello", CropController.hello);
Router.get("/crop/cropspecification/hello", CropSpecificationController.hello);
Router.get("/crop/croprequest/hello", CropSpecificationController.hello);


Router.group((router)=>{

    // router.get();


    /* ------------------------------- Crop ------------------------------ */

    router.post('/crop/add', CropValidation.addCropValidator, CropController.add);
    router.get('/crop/getbycropwanted', CropController.getByCropWanted);
    router.get('/crop/getbycropauction', CropController.getByCropAuctions);
    router.get('/crop/getbycropoffer', CropController.getByCropOffer);
    router.get('/crop/getbyid/:id', CropController.getById);
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
    router.post('/crop/negotiation/decline',NegotiationValidator.negotiation, NegotiationController.declineNegotiation);
    router.post('/crop/negotiation/close',NegotiationValidator.negotiation, NegotiationController.closeNegotiation);
    router.get('/crop/negotiation/grabtransactionby/:status/:userid', NegotiationController.getNegotiationTransactionSummary);
    router.get('/crop/negotiation/getallsummary', NegotiationController.getAllNegotiationTransactionSummary);


    /* ---------------------------------- Order --------------------------------- */
    router.post('/crop/order/add', OrderValidators.createOrderValidator, OrderController.createNewOrder);
    router.get('/order/:order', OrderController.getByOrderHash);
    router.get('/crop/order/getbybuyer/:buyerid/:buyertype', OrderController.getByBuyer);
    router.get('/crop/order/getbynegotiationid/:negotiationid', OrderController.getByNegotiationId);
    router.get('/crop/order/getbypaymentstatus/:paymentstatus', OrderController.getByPaymentStatus);
    // Tracking Details
    router.post('/crop/trackingdetails/updatebyorderid', OrderValidators.updateTrackingDetailsValidators, OrderController.updateTrackingDetailsByOrderId);
    // Waybill Details
    router.post('/crop/waybilldetails/updatebyorderid', OrderValidators.updateWaybillDetailsValidators, OrderController.updateWaybillDetailsByOrderId);
    // Goodreceiptnote Details
    router.post('/crop/goodreceiptnote/updatebyorderid', OrderValidators.updateGoodReceiptDetailsValidators, OrderController.updateWaybillDetailsByOrderId);


    /* ---------------------------------- Transaction --------------------------------- */
    router.post('/crop/transaction/add', TransactionValidator.addTransactionValidator, TransactionController.createNewTransaction );
});


/* -------------------------------------------------------------------------- */
/*                             INPUT MARKET PLACE                             */
/* -------------------------------------------------------------------------- */



/* -------------------------------------------------------------------------- */
/*                             INPUT MARKET PLACE                             */
/* -------------------------------------------------------------------------- */

Router.group((router) => {
    /* ---------------------------------- Input ---------------------------------- */
    router.post('/input/add', InputsValidator.createInputValidator,Input.createInput);
    router.get('/input/getallbyuserid/:user_id', Input.getallInputsByUser);
    router.get('/input/getall', Input.getallInputs);
    router.get('/input/getallbycategory/:category', Input.getallInputsByCategory);
    router.get('/input/getallbymanufacturer/:manufacturer', Input.getallInputsByManufacturer);
    router.get('/input/getallbypackaging/:packaging', Input.getallInputsByPackaging);

    
    /* ---------------------------------- CART ---------------------------------- */
    router.post('/input/cart/add', InputsValidator.addToCartValidator,Cart.addtoCart);
    router.get('/input/cart/getallcartbyuserid/:user_id', Cart.getUserInputCart);
    router.get('/input/cart/delete/:id', Cart.deleteCartItem);

    
    /* ---------------------------------- Order --------------------------------- */
    router.post('/input/order/add', OrderValidators.InputOrderValidator, OrderController.createInputOrder);
    router.post('/input/order/updateinputorder', OrderValidators.updateOrderValidator, OrderController.updateOrderPayment);
    router.get('/input/order/history/getbyuserid/:user_id', OrderController.getOrderHistoryByUserId);
})

module.exports = Router;



