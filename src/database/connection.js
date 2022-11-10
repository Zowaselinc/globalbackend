
// IMPORT SQL CONNECTOR

const MySQL2Extended = require('mysql2-extended');
const mysql2 = require('mysql2/promise');

var mysql = require('mysql2');

require('dotenv').config();

//Connection class to connect to database

class Connection {

    static async open(callback) {
        var that = this;
        if (this.db) return this.db;

        const pool = mysql2.createPool({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            port : process.env.DATABASE_PORT ?? 3306
        });
        
        const db = new MySQL2Extended.MySQL2Extended(pool);

        that.db = db;

        callback();
    }

}




//Raw Connection class to connect to database

class RawConnection {

    static async open(callback) {
        var that = this;
        if (this.db) return this.db;


        var connection = mysql.createConnection({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            port : process.env.DATABASE_PORT ?? 3306
        });

        connection.connect();

        that.db = connection;

        callback();
    }

}



Connection.db = null;

RawConnection.db = null;


module.exports = { Connection, RawConnection };
