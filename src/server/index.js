
const express = require('express');
const App = express();
const Routes = require('~routes');

const DB = require("~database/models");

const { Connection, RawConnection } = require('~database/connection');
const { User } = require('../models');

class Server{

    static boot(port=3000){

        // Register App Routes
        Routes(App).register();
        

        //Sync Database Models
        //{ force: true }
        DB.sequelize.sync({ force: true })
        .then(() => {
            console.log("Synced db.");
        })
        .catch((err) => {
            console.log("Failed to sync db: " + err.message);
        });

        const test = async function(){
            var user = await User();
        }
        test();

        //Init database before starting server
        Connection.open(()=>{

            RawConnection.open(()=>{
            })


            //Initialize app requirements
            // app.use(ejsLayouts);
            // app.set('layout', './layouts/main')
            // app.set("layout extractScripts", true)
            // app.set("view engine", "ejs");
            // app.use(express.json());
            // app.use(express.urlencoded({ extended: false }));
            // app.use(express.static("src/public"));
            // app.set('trust proxy', 1);



            App.listen(port, () => {
                console.log(`Example app listening on port ${port}`)
            })
        });



    }
    
}

module.exports = Server;
