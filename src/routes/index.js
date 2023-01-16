
const ApiRouter = require('./api');

var express = require('express');

const bodyParser = require("body-parser");

const fileUpload = require('express-fileupload');

class Routes{

    constructor(app){
        this.app = app;

        this.app.use(fileUpload()); // Don't forget this line!
        //Here we are configuring express to use body-parser as middle-ware.
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
        this.app.use(express.static('public'))

    }

    register(){
        this.applyRoutes(ApiRouter,'/api');
    }

    applyRoutes( router, prefix = "" ){
        let instance = this

        if(router.groups.length){
            router.groups.forEach(route=> {
                instance.app.use(prefix,route);
            });
        }

        instance.app.use(prefix,router);
        
    }
}

module.exports = (args) => { return new Routes(args) };