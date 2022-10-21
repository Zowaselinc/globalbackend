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


    get(path,handler){
        if(this.middleware){
            return this.router.get(path,this.middleware,handler);
        }
        return this.router.get(path,handler);
    }

    post(path,handler){
        if(this.middleware){
            return this.router.post(path,this.middleware,handler);
        }
        return this.router.post(path,handler);
    }

    patch(path,handler){
        if(this.middleware){
            return this.router.patch(path,this.middleware,handler);
        }
        return this.router.patch(path,handler);
    }

    put(path,handler){
        if(this.middleware){
            return this.router.put(path,this.middleware,handler);
        }
        return this.router.put(path,handler);
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