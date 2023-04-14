const express = require('express');
const mysqlPool = require('../../database/mysql');
const router = express.Router();


router.get('/', (req, res) => {
    res.render('home/wishlist')
})

router.post('/create-new-wishlist', async (req, res, next) => {
    const {ID} = req.body
    const user = req.session.user

    let getProduct = "SELECT * FROM products WHERE PRODUCT_ID = ?"
    const product = await new Promise((resolve, reject) => {
        mysqlPool.query(getProduct, [ID], (err, rows) => {
            if (err) reject(err)
            resolve(rows[0])
        })
    })
    try {
        if (user) {
           

            let getList = "SELECT * FROM wishlist WHERE PRODUCT_ID = ? AND USER_ID = ?"
            const wishList = await new Promise((resolve, reject) => {
                mysqlPool.query(getList, [ID, user.USER_ID], (err, rows) => {
                    if (err) reject(err)
                    resolve(rows)
                })
            })

            if (wishList.length === 0) {
                const sql = "INSERT INTO `wishlist` (PRODUCT_ID,PRODUCT_IMAGE,PRODUCT_PRICE,PRODUCT_DETAILS,USER_ID) VALUES (?,?,?,?,?)"

                const data = [
                    ID,
                    product.MAIN_IMAGE,
                    product.PRODUCT_PRICE,
                    product.PRODUCT_DESCRIPTION.slice(0, 100),
                    user.USER_ID,
                ];

                mysqlPool.query(sql, data)

                res.json({
                    type: 'message',
                    message: 'Product Added To Wishlist'
                })

            } else {
                res.json({
                    type: 'message',
                    message: 'Product is already in your Wishlist'
                })
            }
        } else {
            res.json({
                type: 'link',
                link: `/login?ref=/product/${product.SLUG_ID}&action=list`
            })
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({
            type: 'error',
            message: 'Server Error'
        })
    }
})


module.exports = router