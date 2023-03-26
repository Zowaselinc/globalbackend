const http = require("http");

class Socket {

    constructor() {
        this.init = false;
    }

    initSocket(app, callback) {

        this.app = app;

        this.server = http.createServer(this.app);

        this.io = require("socket.io")(this.server);

        this.init = true;

        this.io.on("connection", (socket) => {
            this.socket = socket;
            /* --------------------------- REGISTER SOCKET EVENT --------------------------- */


        });

        callback(this.server);
    }
}

const AppSocket = new Socket();

module.exports = AppSocket;
