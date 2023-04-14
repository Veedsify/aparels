const express = require("express");
const router = express.Router();
const mysqlPool = require("../../database/mysql");
const util = require("util");
const SQLquery = util.promisify(mysqlPool.query).bind(mysqlPool);

router.post("/add/:blog_id", async (req, res) => {
    const { name, email, comment } = req.body;
    const { blog_id } = req.params;
    const refererUrl = req.headers.referer;

    if (!email || !name || !comment || comment.length < 5) {
        return res.redirect(`/blog/`);
    }

    const sql = `
    INSERT INTO blogcomments (USER_EMAIL, USER_ID, USER_IMAGE, NAME, COMMENT, BLOG_ID)
    VALUES (?,?,?,?,?,?)
  `;

    const userId = req.session.user && req.session.user.USER_ID ? req.session.user.USER_ID : "";
    const userImage = req.session.user && req.session.user.PROFILE_IMAGE ? req.session.user.PROFILE_IMAGE : "/IMAGES/placeholder.jpg";

    const data = [email, userId, userImage, name, comment, blog_id.trim()];

    try {
        await SQLquery(sql, data);
        res.redirect(refererUrl);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error inserting comment into database");
    }
});


module.exports = router;
