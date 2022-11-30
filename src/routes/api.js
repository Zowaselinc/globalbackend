
const AuthController = require('~controllers/AuthController');

const UserController = require('~controllers/UserController');

const RouteProvider = require('~providers/RouteProvider');

const { RegisterMerchantBuyerValidator, LoginValidator, RegisterPartnerValidator, RegisterAgentValidator, SendVerificationValidator, ConfirmVerificationValidator, ResetPasswordValidator, VerifyResetTokenValidator} = require('./validators/AuthValidators');


const Router = RouteProvider.Router;


// Authentication Routes

Router.middleware(['isGuest']).group((router)=>{

    router.post('/login',LoginValidator,AuthController.login);

    router.post('/register',RegisterMerchantBuyerValidator,AuthController.registerMerchantBuyer);

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


module.exports = Router;


