const express = require('express');
const router = express.Router();
const mysqlPool = require('../../database/mysql');
const util = require('util');
const SQLquery = util.promisify(mysqlPool.query).bind(mysqlPool);

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    let { count } = req.query;
    var limit = 25;

    if (count === 'all') {
        limit = null;
    } else if (count) {
        count = parseInt(count);
        if (count >= 25 && count < 50) {
            limit = 50;
        } else if (count >= 50 && count < 100) {
            limit = 100;
        }
    }

    const categorys = await SQLquery(`SELECT * FROM products WHERE PRODUCT_CATEGORY = ? ORDER BY ID DESC ${limit ? `LIMIT ${limit}` : ''}`, [id]);
    const [info] = await SQLquery(`SELECT * FROM category WHERE CATEGORY_NAME = ?`, [id]);
    const refererUrl = req.headers.referer;

    if (info && categorys.length > 0) {
        res.render('home/category', { categorys, info });
    } else {
        res.redirect(refererUrl);
    }
});



module.exports = router