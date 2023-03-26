
const express = require('express');

const App = express();

const Routes = require('~routes');

const { DB } = require("~database/models");

const cors = require('cors');
const GlobalUtils = require('~utilities/global');
const AppSocket = require('~providers/Socket');


class Server {
    static boot(port = 3000) {

        App.use(cors({
            origin: '*',
            methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE', 'PATCH']
        }));

        // Register App Routes
        Routes(App).register();

        //Sync Database Models
        //{ force: true }
        DB.sequelize.sync({})
            .then(() => {
                console.log("Synced db.");
            })
            .catch((err) => {
                console.log("Failed to sync db: " + err.message);
            });

        AppSocket.initSocket(App, (server) => {
            server.listen(port, () => {
                console.log(`Example app listening on port ${port}`)
            })
        })

    }
}

module.exports = Server;
