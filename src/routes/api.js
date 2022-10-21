
const AuthController = require('~controllers/AuthController');
const RouteProvider = require('~providers/RouteProvider');

const Router = RouteProvider.Router;

Router.middleware(['isGuest','isVerified']).group((router)=>{

    router.get('/',AuthController.login);
    
});


module.exports = Router;

