
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

const InputsCart = require('~controllers/InputcartController');

/* ------------------------------- VALIDATORS ------------------------------- */

const { RegisterMerchantCorporateValidator, LoginValidator, RegisterPartnerValidator, RegisterAgentValidator, SendVerificationValidator, ConfirmVerificationValidator, ResetPasswordValidator, VerifyResetTokenValidator} = require('./validators/AuthValidators');

const CategoryValidator = require('./validators/CategoryValidator');
const SubCategoryValidator = require('./validators/SubCategoryValidator');
const CropValidation = require('./validators/CropValidation');
const CropSpecificationValidator = require('./validators/CropSpecificationValidator');
const CropRequestValidation = require('./validators/CropRequestValidation');
const NegotiationValidator = require('./validators/NegotiationValidator');
const InputsCartValidator = require('./validators/InputsCartValidator');


/* -------------------------------- PROVIDERS ------------------------------- */

const RouteProvider = require('~providers/RouteProvider');

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
/*                         GENERAL MARKETPLACE ROUTES                         */
/* -------------------------------------------------------------------------- */

Router.group((router) => {

        /* -------------------------------- Category -------------------------------- */
        router.get('/category/:type/getall', CategoryController.getAllCategories);
        router.get('/category/:type/getall/:offset/:limit', CategoryController.getAllByLimit);
        router.get('/category/:id', CategoryController.getById);
        // router.post('/crop/category/add', CategoryValidator.addCategoryValidator, CategoryController.add);
        // router.post('/crop/category/editbyid', CategoryValidator.addCategoryValidator, CategoryController.editbyid);
        // router.post('/crop/category/deletebyid', CategoryController.deletebyid);
    
        /* ------------------------------- SubCategory ------------------------------ */

        router.get('/subcategory/getbycategory/:categoryId', SubCategoryController.getByCategory);
        router.get('/subcategory/:id', SubCategoryController.getById);
        // router.post('/crop/subcategory/add', SubCategoryValidator.addSubCategoryValidator, SubCategoryController.add);
        // router.post('/crop/subcategory/editbyid', SubCategoryValidator.addSubCategoryValidator, SubCategoryController.editbyid);
        // router.post('/crop/subcategory/deletebyid', SubCategoryController.deletebyid);


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
    router.post('/crop/product/add', CropValidation.addCropValidator, CropController.add);
    router.get('/crop/product/getbyproductwanted', CropController.getbyproductwanted);
    router.get('/crop/product/getbyproductoffer', CropController.getbyproductoffer);
    router.post('/crop/product/getbyid', CropController.getbyid);
    router.post('/crop/product/editbyid', CropValidation.addCropValidator, CropController.editbyid);


    /* ------------------------------- Crop Specification ------------------------------ */
    router.post('/crop/cropspecification/add', CropSpecificationValidator.addCropSpecificationValidator, CropSpecificationController.add);
  



    /* ------------------------------- Crop Request ------------------------------ */
    router.post('/crop/croprequest/add', CropRequestValidation.addCropRequestValidator, CropRequestController.add);
    router.get('/crop/croprequest/getall', CropRequestController.getall);
    router.get('/crop/croprequest/getall/:offset/:limit', CropRequestController.getallbyLimit);
    router.post('/crop/croprequest/getbyid', CropRequestController.getbyid);
    router.post('/crop/croprequest/getbyproductid', CropRequestController.getbyproductid);
    router.post('/crop/croprequest/editbyid', CropRequestController.editbyid);



    /* ------------------------------- Negotiation ------------------------------ */
    router.post('/crop/negotiation/add', NegotiationValidator.addNegotiationValidator, NegotiationController.add);
    router.post('/crop/negotiation/admin/add', NegotiationValidator.addNegotiationValidator, NegotiationController.addmsgbyadmin);
    router.get('/crop/negotiation/getbyuserid/:userid', NegotiationController.getbyuserid);
    router.post('/crop/negotiation/acceptnegotiation/:id', NegotiationController.acceptNegotiation);

});


/* -------------------------------------------------------------------------- */
/*                             INPUT MARKET PLACE                             */
/* -------------------------------------------------------------------------- */



/* -------------------------------------------------------------------------- */
/*                                INPUT PRODUCT                               */
/* -------------------------------------------------------------------------- */
/* ---------------------------------- INPUT --------------------------------- */
Router.group((router) => {

    
})

/* ---------------------------------- CART ---------------------------------- */
Router.group((router) => {
    router.post('/input/cart/add', InputsCartValidator.addToCartValidator,InputsCart.addtoCart);
    // router.get('/input/cart/getall/:user_id', InputsCart.getUserInputCart);
})

module.exports = Router;



