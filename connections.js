const mysql = require("mysql2");

// Define the database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "dolphin4275",
    database: "employee_db",
});

module.exports = db;