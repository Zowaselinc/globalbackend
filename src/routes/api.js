
const AuthController = require('~controllers/AuthController');
const RouteProvider = require('~providers/RouteProvider');
const { RegisterMerchantBuyerValidator, LoginValidator, RegisterPartnerValidator, RegisterAgentValidator, SendVerificationValidator, ConfirmVerificationValidator } = require('./validators/AuthValidators');

const Router = RouteProvider.Router;

Router.middleware(['isGuest']).group((router)=>{

    router.post('/login',LoginValidator,AuthController.login);

    router.post('/register',RegisterMerchantBuyerValidator,AuthController.registerMerchantBuyer);

    router.post('/register/partner',RegisterPartnerValidator,AuthController.registerPartner);

    router.post('/register/agent',RegisterAgentValidator,AuthController.registerAgent);

    router.post('/register/verify',SendVerificationValidator,AuthController.sendVerificationCode);

    router.post('/register/confirm',ConfirmVerificationValidator,AuthController.verifyCode);

});


module.exports = Router;

