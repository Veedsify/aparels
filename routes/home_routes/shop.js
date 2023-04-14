const express = require('express');
const router = express.Router();
const mysqlPool = require('../../database/mysql');
const util = require('util');
const SQLquery = util.promisify(mysqlPool.query).bind(mysqlPool);

router.get('/', async (req, res) => {
    let getCategories = `SELECT * FROM category`

    const categories = await SQLquery(getCategories)

    let getLatest = await SQLquery("SELECT * FROM products WHERE ADMIN_STATUS = ? AND USER_STATUS =?  ORDER by ID DESC", ['ENABLED', 'ENABLED'])


    res.render('home/shop', { categories, getLatest })
})

router.get('/shop', (req, res) => {


    res.render('home/404')

});


module.exports = router