const Server = require("./src/server");

require('dotenv').config();

Server.boot(process.env.APP_PORT ?? 3000);