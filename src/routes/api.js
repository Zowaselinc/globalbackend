const Controller = require("~controllers/Controller");

const AuthController = require('~controllers/AuthController');

const UserController = require('~controllers/UserController');

const ProductController = require('~controllers/ProductController');

const CategoryController = require('../controllers/CategoryController');

const SubCategoryController = require('../controllers/SubCategoryController');

const ProductRequestController = require('../controllers/ProductRequestController');

const ProductSpecificationController = require('../controllers/ProductSpecificationController');

const NegotiationController = require('../controllers/NegotiationController');

const RouteProvider = require('~providers/RouteProvider');

const { RegisterMerchantCorporateValidator, LoginValidator, RegisterPartnerValidator, RegisterAgentValidator, SendVerificationValidator, ConfirmVerificationValidator, ResetPasswordValidator, VerifyResetTokenValidator} = require('./validators/AuthValidators');


const CategoryValidator = require('./validators/CategoryValidator');
const SubCategoryValidator = require('./validators/SubCategoryValidator');
const ProductValidation = require('./validators/ProductValidation');
const ProductSpecificationValidator = require('./validators/ProductSpecificationValidator');
const ProductRequestValidation = require('./validators/ProductRequestValidation');
const NegotiationValidator = require('./validators/NegotiationValidator');

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
Router.get("/crop/product/hello", ProductController.hello);
Router.get("/crop/productspecification/hello", ProductSpecificationController.hello);
Router.get("/crop/productrequest/hello", ProductSpecificationController.hello);


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


    /* ------------------------------- Product ------------------------------ */
    router.post('/crop/product/add', ProductValidation.addProductValidator, ProductController.add);
    router.get('/crop/product/getbyproductwanted', ProductController.getbyproductwanted);
    router.get('/crop/product/getbyproductoffer', ProductController.getbyproductoffer);
    router.post('/crop/product/getbyid', ProductController.getbyid);
    router.post('/crop/product/editbyid', ProductValidation.addProductValidator, ProductController.editbyid);


    /* ------------------------------- Product Specification ------------------------------ */
    router.post('/crop/productspecification/add', ProductSpecificationValidator.addProductSpecificationValidator, ProductSpecificationController.add);
  



    /* ------------------------------- Product Request ------------------------------ */
    router.post('/crop/productrequest/add', ProductRequestValidation.addProductRequestValidator, ProductRequestController.add);
    router.get('/crop/productrequest/getall', ProductRequestController.getall);
    router.get('/crop/productrequest/getall/:offset/:limit', ProductRequestController.getallbyLimit);
    router.post('/crop/productrequest/getbyid', ProductRequestController.getbyid);
    router.post('/crop/productrequest/getbyproductid', ProductRequestController.getbyproductid);
    router.post('/crop/productrequest/editbyid', ProductRequestController.editbyid);



    /* ------------------------------- Negotiation ------------------------------ */
    router.post('/crop/negotiation/add', NegotiationValidator.addNegotiationValidator, NegotiationController.add);
    router.post('/crop/negotiation/admin/add', NegotiationValidator.addNegotiationValidator, NegotiationController.addmsgbyadmin);
    router.get('/crop/negotiation/getbyuserid/:userid', NegotiationController.getbyuserid);
    router.post('/crop/negotiation/acceptnegotiation/:id', NegotiationController.acceptNegotiation);

});

module.exports = Router;


