const mysql = require('mysql');

if (!process.env.JAWSDB_URL) {
    require('dotenv').config();
}

function connect_db(db_name) {
    if (process.env.JAWSDB_URL) {
        return mysql.createConnection(process.env.JAWSDB_URL);
    }
    return mysql.createConnection({
        host: 'localhost',
        user: process.env.SQLUSER,
        password: process.env.SQLPASS,
        port: 3306,
        database: db_name,
        insecureAuth: true,
    });
}

function close_db(connection) {
    return new Promise((resolve, reject) => {
        connection.end((err) => {
            if (err) reject(err);
            resolve();
        });
    });
}

module.exports = { connect_db, close_db };
