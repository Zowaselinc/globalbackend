const AuthMiddleware = require("./auth");


// Register Middleware aliases

const AppMiddlewares = {
    'isGuest' : AuthMiddleware.isGuest,
    'isAuthenticated' : AuthMiddleware.isAuthenticated
};


class Middleware {

    constructor(middleware){

        this.middlewares = typeof middleware == "object" ? middleware : [middleware];

    }

    chain( req, res ){
        for(var i = 0; i < this.middlewares.length ; i++){
            var mware = this.middlewares[i];
            if(!res.headersSent){
                AppMiddlewares[mware]( req , res );
            }
        }
    }

    handle( req, res, next ){

        this.chain(req, res);

        if(!res.headersSent){
            next();
        }
    }

}


module.exports = (...args) => { return new Middleware(...args) };