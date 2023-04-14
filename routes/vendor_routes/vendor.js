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
// router.use('/user', userRouter)
// router.use('/configuration', configurationRouter)
router.use('/order', orderRouter)
// router.use('/pages', pagesRouter)


router.get('/', (req, res) => {
    let user = req.session.user;
    res.render('vendor/index', { user })
})

function checkUserStatus(req, res, next) {
    const user = req.session.user;

    if (!user) {
        req.session.destroy();
        return res.redirect("/login");
    }

    const { VERIFICATION, ROLE } = req.session.user;

    if (ROLE !== "vendor") {
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


