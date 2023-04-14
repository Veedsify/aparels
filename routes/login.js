const express = require("express");
const router = express.Router();
const mysqlPool = require('../database/mysql');
const util = require('util');
const getHash = require("../configs/getHash");
const SQLquery = util.promisify(mysqlPool.query).bind(mysqlPool);

router.get("/", (req, res) => {
    if (req.query.ref) res.cookie("redirect", req.query.ref, { path: "/" });
    res.render("login");
});

router.get("/forgot", (req, res) => {
    res.render("forget_pwd");
});

router.get("/verification-needed", (req, res) => {
    let user = req.session.user;

    const { EMAIL, OTP_KEY, USER_ID, PASSWORD, CARD_ID } = user;

    let info = "Account Verification Needed!";
    let message = "Please check the verification link sent to your inbox!";
    res.render("register-success", { info, message });
});

router.post("/resend-needed", async (req, res) => {
    const { EMAIL, NAME, OTP_KEY, USER_ID, PASSWORD, CARD_ID } = req.session.user;

    await welcomeEmail(NAME, EMAIL, link, "verify account");
});

router.post("/new", async (req, res) => {
    const { email, password } = req.body;
    let pass = getHash(password).trim()

    try {
        const [rows] = await SQLquery(
            "SELECT * FROM user WHERE EMAIL = ? AND PASSWORD = ? LIMIT 1",
            [email, pass]
        );

        if (!rows) {
            return res.json({
                message: "Invalid email and password combination",
            });
        }

        const user = rows;
        
        if (user.ADMINSTATUS !== "active" && user.ROLE !== 'admin') {
            req.session.destroy();
            return res.json({
                link: "/login/user-deactivated",
            });
        }

        req.session.cookie.httpOnly = true;
        req.session.user = user;

        return res.json({
            link: "/user",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred while processing your request",
        });
    }
});


module.exports = router;
