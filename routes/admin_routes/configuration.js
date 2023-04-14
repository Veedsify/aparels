const express = require("express");
const router = express.Router();
const mysqlPool = require("../../database/mysql");
const util = require('util');
const SQLquery = util.promisify(mysqlPool.query).bind(mysqlPool);
const updateEnv = require("../../configs/updateEnv");

router.get("/pages/home", async (req, res) => {
    const [home1] = await SQLquery(`SELECT * FROM pages WHERE PAGE_LINK = '/home1'`)
    const [home2] = await SQLquery(`SELECT * FROM pages WHERE PAGE_LINK = '/home2'`)
    res.render("admin/configure-home"
        , { home1, home2 });
});

router.get("/payment", (req, res) => {
    let payment = {
        "currency": process.env.PAYSTACK_CURRENCY,
        "public_key": process.env.PAYSTACK_PRIVATE_KEY,
        "secret_key": process.env.PAYSTACK_SECRET_KEY,
    }

    res.render("admin/configure-payments", { payment: payment });
});


router.get("/email", async (req, res) => {

    let smtp = {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        user: process.env.MAIL_USER,
        password: process.env.MAIL_PASSWORD
    }

    let emails = {
        admin_email: process.env.ADMIN_EMAIL,
        contact_email: process.env.CONTACT_EMAIL,
        customer_email: process.env.CUSTOMER_EMAIL,
        inbox_email: process.env.INBOX_EMAIL
    }

    res.render("admin/configure-email", { smtp: smtp, emails: emails });
});

router.get("/pages/about", async (req, res) => {
    const data = await SQLquery(`
        SELECT * FROM teams ORDER BY ID DESC
    `)
    const content = await SQLquery(`
        SELECT * FROM pages WHERE PAGE_LINK = ?
    `, [String('/about')]
    )
    res.render("admin/config-about", { teams: data, content: content[0] });
});

router.get("/pages/all/:page", async (req, res) => {
    const [content] = await SQLquery(`
        SELECT * FROM pages WHERE PAGE_LINK = ?
    `, [String(req.params.page)])

    res.render("admin/config-privacy", { content });
});

router.get("/pages/privacy", (req, res) => {
    res.render("admin/config-privacy");
});
router.get("/pages/terms", (req, res) => {
    res.render("admin/config-terms");
});
router.get("/pages/shiping-returns", (req, res) => {
    res.render("admin/config-shipping-returns");
});

// SERVER CONFIGURATION

router.post("/update/smtp", async (req, res) => {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = req.body;
    process.env.MAIL_HOST = SMTP_HOST;
    process.env.MAIL_PORT = SMTP_PORT;
    process.env.MAIL_USER = SMTP_USER;
    process.env.MAIL_PASS = SMTP_PASSWORD;

    // Update the .env file
    let smtp_detail = ["MAIL_HOST", "MAIL_PORT", "MAIL_USER", "MAIL_PASS"];
    if (updateEnv(smtp_detail)) {
        res.json({ message: "Environment variables updated" });
    }
});

router.post('/update/email', (req, res) => {
    const { admin_email, contact_email, inbox_email, customer_email } = req.body;
    process.env.ADMIN_EMAIL = admin_email;
    process.env.CONTACT_EMAIL = contact_email;
    process.env.INBOX_EMAIL = inbox_email;
    process.env.CUSTOMER_EMAIL = customer_email;

    // Update the .env file
    let email_details = ["ADMIN_EMAIL", "CONTACT_EMAIL", "INBOX_EMAIL", "CUSTOMER_EMAIL"];
    if (updateEnv(email_details)) {
        res.json({ message: "Email variables updated" });
    }
})

router.post('/update/paystack', (req, res) => {
    const { public_key, secret_key, currency } = req.body;
    process.env.FLW_PUBLIC_KEY = public_key;
    process.env.FLW_SECRET_KEY = secret_key;
    process.env.FLW_CURRENCY = currency;

    // Update the .env file
    let payment_details = ["FLW_PUBLIC_KEY", "FLW_SECRET_KEY", "FLW_CURRENCY"];
    if (updateEnv(payment_details)) {
        res.json({ message: "Updated payment variables" });
    }
})

router.delete('/del/:id', async (req, res,) => {
    const { id } = req.params
    await SQLquery(`
        DELETE FROM teams WHERE TEAM_ID = ?
    `, [id]
    )
    res.json()
})

module.exports = router;
