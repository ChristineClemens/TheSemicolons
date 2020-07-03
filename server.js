const express = require("express")
const app = express()
const PORT = process.env.PORT || 3000;

app.listen(PORT,function(){
    console.log("App listening on PORT " + PORT);
})

class Database {
    constructor( config ) {
        this.connection = mysql.createConnection( config );
    }
    query( sql, args ) {
        return new Promise( ( resolve, reject ) => {
            this.connection.query( sql, args, ( err, rows ) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            } );
        } );
    }
    close() {
        return new Promise( ( resolve, reject ) => {
            this.connection.end( err => {
                if ( err )
                    return reject( err );
                resolve();
            });
        });
    }
}

// Access SQL Database
const db = new Database({
    host: "localhost",
    port: 3000,
    user: process.env.SQLUSER,
    password: process.env.SQLPASS,
    database: process.env.DB_NAME,
    insecureAuth : true
});