// import necessary modules
const mysql = require('mysql')
const dotenv = require('dotenv')

try {
    // Load env variables from .env file
    dotenv.config()
    
    // Create MySQL connection pool
    const mysqlPool = mysql.createPool({
        connectionLimit: 10,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        port: process.env.DB_PORT,
        database: process.env.DATA_BASE,
        password: process.env.DB_PASS,
        multipleStatements: true,
        namedPlaceholders: true,
        nestTables: true 
    })


    // Export the created mysql pool instance
    module.exports = mysqlPool
} catch (err) {
    console.error(err)
}
