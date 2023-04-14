const express = require('express');
const mysqlPool = require('../../database/mysql');
const router = express.Router();


router.get('/:slugid', async (req, res) => {
    const { slugid } = req.params
    const sql = "SELECT * FROM products WHERE SLUG_ID = ? AND ADMIN_STATUS = ? AND ADMIN_SEEN =?  LIMIT 1"
    const productDetails = await new Promise((resolve, reject) => {
        mysqlPool.query(sql, [slugid, 'ENABLED', 'TRUE'], (err, rows) => {
            if (err) throw err
            resolve(rows[0])
        })
    })
    const sql2 = "SELECT * FROM products WHERE ADMIN_STATUS = ? AND ADMIN_SEEN =?  AND NOT SLUG_ID = ?"
    const relatedProducts = await new Promise((resolve, reject) => {
        mysqlPool.query(sql2, ['ENABLED', 'TRUE', slugid], (err, rows) => {
            if (err) throw err
            resolve(rows[0])
        })
    })
    res.render('home/product', { productDetails })
})

router.get('/f/:slugid', async (req, res) => {
    const { slugid } = req.params
    const sql = "SELECT * FROM products WHERE PRODUCT_ID = ?  LIMIT 1"
    const [productDetails] = await new Promise((resolve, reject) => {
        mysqlPool.query(sql, [slugid], (err, rows) => {
            if (err) throw err
            resolve(rows)
        })
    })
    res.redirect(`/product/${productDetails.SLUG_ID}`)
})

router.get('/compare', (req, res) => {
    res.render('home/compare')
})

router.get('/cart', (req, res) => {
    res.render('home/cart')
})


module.exports = router