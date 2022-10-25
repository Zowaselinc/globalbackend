const express = require("express");
const GlobalRouter = express.Router();
const Middleware = require('~middleware');

class Router{

    constructor(middleware=null){

        if(middleware){
            
            this.middleware = (...args)=>{
                Middleware(middleware).handle(...args);
            };

        }

        this.router = express.Router();

    }

    parseArgs(...args){
        let argLen = args.length;

        let path = args[0];
        
        let handler = args[argLen-1];

        let addonMiddleware = argLen > 2  ? args[1] : [];

        let middlewares = [];

        if(this.middleware){
            middlewares.push(this.middleware);
        }

        var finalArgs = [path,[ ...middlewares, ...addonMiddleware ],handler];

        return finalArgs;
    }


    get(...args){
        return this.router.get(...this.parseArgs(...args));
    }

    post(...args){
        return this.router.post(...this.parseArgs(...args));
    }

    patch(...args){
        return this.router.patch(...this.parseArgs(...args));
    }

    put(...args){
        return this.router.put(...this.parseArgs(...args));
    }
}



class RouteProvider{

    constructor(){

        this.Router = express.Router();

        this.Router.parent = null;

        this.Router.middleware = null;

        this.Router.groups = [];

        // Register Router grouping function

        this.Router.group = (routes)=>{
            return this.group(routes, this.Router);
        };

        // Register middleware function

        this.Router.middleware = (middleware)=>{
            return this.middleware(middleware,this.Router);
        };
    }


    // Custom middleware function to add to router

    middleware(middleware,parentRouter){
        // Apply middleware here
        const SubRouter = (new RouteProvider()).Router;

        SubRouter.parent = parentRouter;

        SubRouter.middleware = middleware;

        return SubRouter;
    }

    // Custom route grouper for express router
    group(routes, currentRouter){

        const router = new Router(currentRouter.middleware); 

        routes(router);

        currentRouter.parent.groups.push(router.router);

    }

}




module.exports = (new RouteProvider());