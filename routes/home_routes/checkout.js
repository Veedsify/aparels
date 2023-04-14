const express = require("express");
const mysqlPool = require("../../database/mysql");
const router = express.Router();


router.use(checkUserStatus)
router.get("/", async (req, res) => {
    const { USER_ID } = req.session.user;
    const cartItems = await new Promise((resolve, reject) => {
        const sql = `SELECT * FROM cart WHERE USER_ID = ?; SELECT SUM(total_price) AS total
                 FROM(
                   SELECT SUM(TOTAL) AS total_price
                   FROM cart
                   WHERE USER_ID = ?
                   GROUP BY PRODUCT_ID
                 ) AS subquery
               ;`;
        mysqlPool.query(sql, [USER_ID, USER_ID], (err, rows) => {
            if (err) reject(err);
            resolve(rows);
        });
    });


    const [cartItemsData, totalsData] = cartItems;
    const { total: totalAmount } = totalsData[0];

    res.render("home/checkout", {
        cartItems: cartItemsData,
        totals: totalAmount,
        shippingFee: process.env.SHIPPING_FEE
    });
});


function checkUserStatus(req, res, next) {
    const user = req.session.user;

    let myUrl;

    if (req.method === "GET") {
        myUrl = req.originalUrl;
    }

    if (!user) {

        req.session.destroy();
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            // This is an AJAX request
            return res.json({ link: '/login' });
        } else {
            // This is a normal request
            return res.redirect(`/login?ref=${myUrl}`);
        }

    }

    const { VERIFICATION, ROLE } = req.session.user;
    const allowedRoles = ["user", "vendor"];

    if (!allowedRoles.includes(ROLE)) {
        return res.redirect(`/${ROLE}`);
    }

    if (VERIFICATION === "false") {
        return res.redirect("/login/verification-needed");
    }

    // Call next() to continue processing the request
    next();
}

module.exports = router;
