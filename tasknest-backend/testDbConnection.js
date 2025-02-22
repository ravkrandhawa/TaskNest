const pool = require("./config/db"); 

pool.query("SELECT NOW()", (err, res) => {
    if (err) {
        console.log("Datebase connection error", err); 
    } else {
        console.log("Connected to PostgreSQL at:", res.rows[0].now); 
    }
    pool.end(); 
});