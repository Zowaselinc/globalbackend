
const AuthController = require('~controllers/AuthController');
const RouteProvider = require('~providers/RouteProvider');
const { RegisterMerchantValidator, LoginValidator, RegisterPartnerValidator } = require('./validators/AuthValidators');

const Router = RouteProvider.Router;

Router.middleware(['isGuest']).group((router)=>{

    router.post('/login',LoginValidator,AuthController.login);

    router.post('/partner/login',LoginValidator,AuthController.login);

    router.post('/merchant/register',RegisterMerchantValidator,AuthController.registerMerchant);

    router.post('/partner/register',RegisterPartnerValidator,AuthController.registerPartner);

});


module.exports = Router;

