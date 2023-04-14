const mysqlPool = require("./mysql");

async function getData() {
    return await new Promise((resolve, reject) => {
        mysqlPool.query("SELECT * FROM website", function (error, result) {
            resolve(result[0]);
        })
    })
}

getData()
    .then(result => {
        module.exports = result;
    })