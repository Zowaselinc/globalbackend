
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
const Inputs = require('~controllers/InputProductController');

const InputsCart = require('~controllers/InputcartController');

/* ------------------------------- VALIDATORS ------------------------------- */

const { RegisterMerchantCorporateValidator, LoginValidator, RegisterPartnerValidator, RegisterAgentValidator, SendVerificationValidator, ConfirmVerificationValidator, ResetPasswordValidator, VerifyResetTokenValidator} = require('./validators/AuthValidators');

const CategoryValidator = require('./validators/CategoryValidator');
const SubCategoryValidator = require('./validators/SubCategoryValidator');
const CropValidation = require('./validators/CropValidation');
const NegotiationValidator = require('./validators/NegotiationValidator');
const InputsValidator = require('./validators/InputsValidator');


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
    /* -------------------------------- Category -------------------------------- */
    router.post('/crop/category/add', CategoryValidator.addCategoryValidator, CategoryController.add);
    router.get('/crop/category/getall', CategoryController.getall);
    router.get('/crop/category/getall/:offset/:limit', CategoryController.getallbyLimit);
    router.post('/crop/category/getbyid', CategoryController.getbyid);
    router.post('/crop/category/editbyid', CategoryValidator.addCategoryValidator, CategoryController.editbyid);
    router.post('/crop/category/deletebyid', CategoryController.deletebyid);

    /* ------------------------------- SubCategory ------------------------------ */
    router.post('/crop/subcategory/add', SubCategoryValidator.addSubCategoryValidator, SubCategoryController.add);
    router.post('/crop/subcategory/getbycategory', SubCategoryController.getbycategory);
    router.post('/crop/subcategory/getbyid', SubCategoryController.getbyid);
    router.post('/crop/subcategory/editbyid', SubCategoryValidator.addSubCategoryValidator, SubCategoryController.editbyid);
    router.post('/crop/subcategory/deletebyid', SubCategoryController.deletebyid);


    /* ------------------------------- Crop ------------------------------ */
    router.post('/crop/add', CropValidation.addCropValidator, CropController.add);
    router.get('/crop/getbycropwanted', CropController.getByCropWanted);
    router.get('/crop/getbycropoffer', CropController.getByCropOffer);
    router.get('/crop/getbyid/:id', CropController.getById);
    router.post('/crop/editbyid', CropValidation.addCropValidator, CropController.EditById);


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
    router.post('/crop/negotiation/admin/add', NegotiationValidator.addNegotiationValidator, NegotiationController.addmsgbyadmin);
    router.get('/crop/negotiation/getbyuserid/:userid', NegotiationController.getbyuserid);
    router.post('/crop/negotiation/acceptnegotiation/:id', NegotiationController.acceptNegotiation);

});


/* -------------------------------------------------------------------------- */
/*                             INPUT MARKET PLACE                             */
/* -------------------------------------------------------------------------- */


/* -------------------------- category route group -------------------------- */
Router.group((router) => {
    router.post('/input/category/add', CategoryValidator.createCategoryValidator, CategoryController.createCategory);
    router.get('/input/category/getall', CategoryController.getAllCategories);
    router.get('/input/category/getallparams/:offset/:limit', CategoryController.getCategories);
    router.get('/input/category/getbyid/:id', CategoryController.getCategoryById);
    router.post('/input/category/delete', CategoryValidator.deleteCategoryValidator, CategoryController.deleteCategory);
    router.post('/input/category/update', CategoryValidator.updateCategoryValidator, CategoryController.updateCategory);
})


/* ------------------------- subcategory route group ------------------------ */
Router.group((router) => {
    router.post('/input/subcategory/add', SubCategoryValidator.createSubCategoryValidator, SubCategoryController.createSubcategory);
    router.get('/SubCategoryValidator.createSubCategoryValidatornput/subcategory/getallbycategoryid/:id', SubCategoryValidator.getSubCategoryValidator, SubCategoryController.getAllSubCategories);
    router.get('/input/subcategory/getallparams/:id/:offset/:limit', SubCategoryController.getSubCategories);
    router.get('/input/subcategory/getbyid/:id', SubCategoryController.getSubCategoryById);
    // router.post('/input/subcategory/delete', SubCategoryValidator.deleteCategoryValidator, SubCategoryController.deleteCategory);
    // router.post('/input/subcategory/update', SubCategoryValidator.updateCategoryValidator, SubCategoryController.updateCategory);
})

/* -------------------------------------------------------------------------- */
/*                                INPUT PRODUCT                               */
/* -------------------------------------------------------------------------- */
/* ---------------------------------- INPUT --------------------------------- */
Router.group((router) => {

    
})

/* ---------------------------------- CART ---------------------------------- */
Router.group((router) => {

    router.post('/input/add', InputsValidator.createInputValidator,Inputs.createInput);
    router.get('/input/getallbyuserid/:user_id', Inputs.getallInputsByUser);
    router.get('/input/getall', Inputs.getallInputs);
    router.get('/input/getallbycategory/:category', Inputs.getallInputsByCategory);
    router.get('/input/getallbymanufacturer/:manufacturer', Inputs.getallInputsByManufacturer);
    router.get('/input/getallbypackaging/:packaging', Inputs.getallInputsByPackaging);
})

/* ---------------------------------- CART ---------------------------------- */
Router.group((router) => {
    router.post('/input/cart/add', InputsValidator.addToCartValidator,InputsCart.addtoCart);
    router.get('/input/cart/getallcartbyuserid/:user_id', InputsCart.getUserInputCart);
    router.get('/input/cart/delete/:id', InputsCart.deleteCartItem);
})

module.exports = Router;



