const express = require("express");
const mysqlPool = require("../../database/mysql");
const router = express.Router();
const profile = require("./profile");
const util = require('util');
const SQLquery = util.promisify(mysqlPool.query).bind(mysqlPool);

// Pass checkUserStatus as middleware instead of calling it
router.use(checkUserStatus);

router.use("/profile", profile);

router.get("/", async (req, res) => {
    let user = req.session.user;

    if (user.ROLE == 'admin') {
        res.redirect('/admin')
    }

    let wish = await new Promise((resolve, reject) => {
        let getWishList = "SELECT * FROM wishlist WHERE USER_ID = ?"
        try {
            mysqlPool.query(getWishList, [user.USER_ID], (err, rows) => {
                resolve(rows)
            })
        } catch (err) {
            console.log(err)
        }
    })

    let order = await new Promise((resolve, reject) => {
        let getOrder = "SELECT * FROM `order` WHERE USER_ID = ? AND PAYMENT_SUCCESSFUL = ?"
        try {
            mysqlPool.query(getOrder, [user.USER_ID, 'TRUE'], (err, rows) => {
                resolve(rows)
            })
        } catch (err) {
            console.log(err)
        }
    })

    let orderCountPending = await new Promise((resolve, reject) => {
        let getOrder = "SELECT * FROM `order` WHERE USER_ID = ? AND PAYMENT_SUCCESSFUL = ? AND ORDER_STATUS = ?"
        try {
            mysqlPool.query(getOrder, [user.USER_ID, 'TRUE', 'pending'], (err, rows) => {
                resolve(rows.length)
            })
        } catch (err) {
            console.log(err)
        }
    })

    res.render("user/dashboard", { user: user, wishlist: wish, wishCount: wish.length, order, orderCount: order.length, orderCountPending });
});

router.get('/account-info', (req, res) => {
    res.render('user/account-info')
})
router.post('/account-info/update', async (req, res) => {
    const { name, email, country, state, city, zip, street, phone1 } = req.body
    const { USER_ID } = req.session.user
    try {

        let sql = `
            UPDATE user SET NAME = ?, EMAIL = ?, COUNTRY = ?, STATE = ?, CITY = ?, ZIP_CODE = ?, ADDRESS =?, PHONE = ? WHERE USER_ID = ?
        `;

        await SQLquery(sql, [name, email, country, state, city, zip, street, phone1, USER_ID]);

        req.session.user.NAME = name;
        req.session.user.EMAIL = email;
        req.session.user.STATE = state;
        req.session.user.CITY = city;
        req.session.user.COUNTRY = country;
        req.session.user.ADDRESS = street;
        req.session.user.PHONE = phone1;
        req.session.user.ZIP_CODE = zip;


        res.redirect('/user/account-info')

    } catch (err) {
        console.log(err)
    }
    res.render('user/account-info')
})

function checkUserStatus(req, res, next) {
    const user = req.session.user;

    if (!user) {
        req.session.destroy();
        return res.redirect("/login");
    }

    const { VERIFICATION, ROLE } = req.session.user;
    const allowedRoles = ["user", "vendor"];

    if (!allowedRoles.includes(ROLE)) {
        return res.redirect(`/${ROLE}`);
    }

    if (VERIFICATION === 'false') {
        return res.redirect("/login/verification-needed");
    }

    // Call next() to continue processing the request
    next();
}

module.exports = router;