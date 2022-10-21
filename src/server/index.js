
const express = require('express');
const App = express();
const Routes = require('~routes');

class Server{

    static boot(port=3000){

        // Register App Routes
        Routes(App).register();

        App.listen(port, () => {
          console.log(`Example app listening on port ${port}`)
        })


    }
    
}

module.exports = Server;
