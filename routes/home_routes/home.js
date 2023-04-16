const express = require('express');
const router = express.Router();
const blog = require('./blog');
const about = require('./about');
const shop = require('./shop');
const contact = require('./contact');
const checkout = require('./checkout');
const order = require('./order');
const wishlist = require('./wishlist');
const search = require('./search');
const product = require('./product');
const collection = require('./collection');
const category = require('./category');
const comment = require('./comment');
const pages = require('./pages');
const register = require('../register')
const login = require('../login');
const mysqlPool = require('../../database/mysql');
const util = require('util');
const SQLquery = util.promisify(mysqlPool.query).bind(mysqlPool);


router.use('/blog', blog)
router.use('/about', about)
router.use('/shop', shop)
router.use('/contact', contact)
router.use('/checkout', checkout)
router.use('/order', order)
router.use('/wishlist', wishlist)
router.use('/search', search)
router.use('/product', product)
router.use('/collection', collection)
router.use('/category', category)
router.use('/comment', comment)
router.use('/pages', pages)
router.use('/register', register)
router.use('/login', login)

router.get('/', async (req, res) => {
    let getLatest = "SELECT * FROM products WHERE ADMIN_STATUS = ? AND USER_STATUS =?  ORDER by ID DESC LIMIT 5"
    const latestDrops = await new Promise((resolve, reject) => {
        mysqlPool.query(getLatest, ['ENABLED', 'ENABLED'], (err, rows) => {
            if (err) throw err
            resolve(rows)
        })
    })

    let getCategories = `SELECT * FROM category`

    const category = await new Promise((resolve, reject) => {
        mysqlPool.query(getCategories, (err, rows) => {
            if (err) throw err
            resolve(rows)
        })
    })

    let threeCategories = `SELECT PRODUCT_CATEGORY, COUNT(*) as count
        FROM products
        GROUP BY PRODUCT_CATEGORY
        ORDER BY count DESC;
        `

    const three = await new Promise((resolve, reject) => {
        mysqlPool.query(threeCategories, (err, rows) => {
            if (err) throw err
            resolve(rows)
        })
    })

    const productArr = [];

    for (const item of three) {
        const curatedProducts = await SQLquery(`SELECT * FROM products WHERE ADMIN_STATUS = ? AND PRODUCT_CATEGORY = ? ORDER BY ID DESC`, ['ENABLED', item.PRODUCT_CATEGORY]);
        productArr.push(curatedProducts);
    }

    let blogs = await SQLquery(`SELECT * FROM blogs WHERE BLOG_STATUS = ? AND BLOG_ADMIN_STATUS = ? ORDER BY ID DESC LIMIT 5`, ['active', 'active'])

    const auth_id = req.cookies.client_auth || ''
    const ip = req.ip


    try {
        const today = new Date().toISOString().slice(0, 10);

        // Check if a row with the current date exists
        const [row] = await SQLquery('SELECT * FROM visits WHERE date = ? AND IP_ADDRESS = ?', [today, ip]);

        if (row) {
            // If a row with the current date exists, update the count
            const count = row.count + 1;
            await SQLquery('UPDATE visits SET count = ? WHERE id = ?', [count, row.id]);
        } else {
            // If a row with the current date does not exist, insert a new row
            await SQLquery('INSERT INTO visits (DATE, count, IP_ADDRESS, AUTH_ID) VALUES (?, 1,?,?)', [today, ip, auth_id]);
        }

        // Return a response to the user
    } catch (err) {
        console.error(err);
        res.status(500).send('Error');
    }

    res.render('home/index', { latestDrops, category, blogs, three, productArr })
})

router.get('/email-success', (req, res) => {
    res.render('home/email-success')
})

router.get('/preview/blog/:article', async (req, res) => {
    const { article } = req.params;

    try {
        const [blog] = await SQLquery(`SELECT * FROM blogs WHERE BLOG_ID = ?`, [article]);

        if (blog) {
            const comments = await SQLquery(`SELECT * FROM blogcomments WHERE BLOG_ID = ? ORDER BY ID DESC`, [blog.BLOG_ID]);

            res.render('home/blog-details', { blog, comments });
        } else {
            res.redirect('/blog');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving blog post');
    }
});



module.exports = router;  