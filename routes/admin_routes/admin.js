const express = require('express');
const router = express.Router();
const loginRouter = require('./login')
const registerRouter = require('./register')
const productsRouter = require('./products')
const profileRouter = require('./profile')
const configurationRouter = require('./configuration')
const userRouter = require('./user')
const orderRouter = require('./order')
const blogRouter = require('./blog')
const pagesRouter = require('./pages')
const path = require('path')

router.use(checkUserStatus)
router.use('/login', loginRouter)
router.use('/register', registerRouter)
router.use('/product', productsRouter)
router.use('/blog', blogRouter)
router.use('/profile', profileRouter)
router.use('/user', userRouter)
router.use('/configuration', configurationRouter)
router.use('/order', orderRouter)
router.use('/blog', blogRouter)
router.use('/pages', pagesRouter)

const mysqlPool = require('../../database/mysql');
const util = require('util');
const SQLquery = util.promisify(mysqlPool.query).bind(mysqlPool);



router.get('/', async (req, res) => {
    try {
        const user = req.session.user;
        const today = new Date().toISOString().slice(0, 10);
        const [visitsToday] = await SQLquery('SELECT COUNT(*) AS count FROM visits WHERE date = ?', [today]);

        res.render('admin/index', { user, visitsToday: visitsToday.count });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error');
    }
});


router.post('/get-data-sales', async (req, res, next) => {
    const days = await SQLquery('SELECT DATE FROM `order` WHERE PAYMENT_SUCCESSFUL = ? ORDER BY ID DESC LIMIT 11', ['TRUE']);

    const orders = await SQLquery('SELECT FINAL_PRICE FROM `order` WHERE PAYMENT_SUCCESSFUL = ? ORDER BY ID DESC LIMIT 11', ['TRUE']);

    const finalPrices = orders.map(obj => Math.round(obj.FINAL_PRICE)); // map over the orders array to get an array of final prices
    const dates = days.map(obj => obj.DATE); // map over the orders array to get an array of final prices
    
    res.json({ dates, finalPrices });
});


function checkUserStatus(req, res, next) {
    const user = req.session.user;

    if (!user) {
        req.session.destroy();
        return res.redirect("/login");
    }

    const { VERIFICATION, ROLE } = req.session.user;

    if (ROLE !== "admin") {
        return res.redirect(`/${ROLE}`);
    }

    if (VERIFICATION === 'false') {
        return res.redirect("/login/verification-needed");
    }

    // Call next() to continue processing the request
    res.locals.user = user

    next();
}

module.exports = router;


