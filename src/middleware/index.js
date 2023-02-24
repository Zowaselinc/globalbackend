const AuthMiddleware = require("./auth");


// Register Middleware aliases

const AppMiddlewares = {
    'isGuest': AuthMiddleware.isGuest,
    'isAuthenticated': AuthMiddleware.isAuthenticated,
    'isLandingRefered': AuthMiddleware.isLandingRefered
};


class Middleware {

    constructor(middleware) {

        this.middlewares = typeof middleware == "object" ? middleware : [middleware];

    }

    async chain(req, res) {
        for (var i = 0; i < this.middlewares.length; i++) {
            var mware = this.middlewares[i];
            if (!res.headersSent) {
                await AppMiddlewares[mware](req, res);
            }
        }
    }

    async handle(req, res, next) {

        await this.chain(req, res);

        if (!res.headersSent) {
            next();
        }
    }

}


module.exports = (...args) => { return new Middleware(...args) };