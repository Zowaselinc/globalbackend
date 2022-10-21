
const ApiRouter = require('./api');

const bodyParser = require("body-parser");


class Routes{

    constructor(app){
        this.app = app;

        //Here we are configuring express to use body-parser as middle-ware.
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
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