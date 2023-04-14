const express = require("express");
const escapeHtml = require("escape-html");
const router = express.Router();
const mysqlPool = require("../../database/mysql");
const util = require("util");
const SQLquery = util.promisify(mysqlPool.query).bind(mysqlPool);
const randThisNum = require("../../configs/randomNumbers");
const multer = require("multer");
const createSlug = require("../../configs/slug");
const path = require("path");
const freeMail = require('../../mailer/freemail')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/BLOG_IMAGES/");
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname;
        const ext = path.extname(fileName);
        const imageName = `BIMG_${randThisNum(10000000, 99999999)}${ext}`;
        cb(null, imageName);
    },
});
const upload = multer({storage: storage});

router.get("/new", (req, res) => {
    res.render("admin/new-blog");
});

router.get("/edit/:blog_id", async (req, res) => {
    const {blog_id} = req.params;
    const blogs = await SQLquery(`SELECT *
                                  FROM blogs
                                  WHERE BLOG_ID = ?`, [
        blog_id,
    ]);
    res.render("admin/edit-blog", {blogData: blogs[0]});
});

router.get("/", async (req, res) => {
    const blogs = await SQLquery(
        `SELECT *
         FROM blogs
         WHERE BLOG_ADMIN_STATUS = ?
           AND SEEN = ?`,
        ["inactive", "false"]
    );
    res.render("admin/blog", {blogs});
});
router.get("/views", async (req, res, next) => {
    const {USER_ID} = req.session.user;
    const blogs = await SQLquery(
        `SELECT *
         FROM blogs
         WHERE BLOG_USER = ?
         ORDER BY ID DESC`,
        [USER_ID]
    );
    res.render("admin/editblog", {blogs});
});

router.post("/audit", async (req, res) => {
    try {

        const {action, id, textareaValue} = req.body;
        const status = action === 'inactive' ? 'inactive' : 'active'
        const message = action === 'inactive' ? 'Post has been rejected' : 'Post has been approved'

        await SQLquery(
            `UPDATE blogs
             SET BLOG_ADMIN_STATUS = ?,
                 SEEN = ?
             WHERE BLOG_ID = ?`,
            [status, "true", id]
        )
        const [blog] = await SQLquery(`SELECT *
                                       FROM blogs
                                       WHERE BLOG_ID = ?`, [id])
        const user = await SQLquery(`SELECT *
                                     FROM user
                                     WHERE USER_ID = ?`, [blog.BLOG_USER])
        // EMAIL OR NOTIFY BLOG USER WITH THE TEXTAREA

        await freeMail(user.NAME, user.EMAIL, `Hi, your post has been set to ${status} By and Admin <br> ${message}`, `You're blog post status has been updated`)

        res.json({
            message
        })

    } catch (err) {
        console.log(err)
        res.status(500)
    }
});

router.delete("/audit", async (req, res) => {
    try {

        const {id} = req.body;

        const [blog] = await SQLquery(`SELECT *
                                       FROM blogs
                                       WHERE BLOG_ID = ?`, [id])
        await SQLquery(
            `DELETE
             FROM blogs
             WHERE BLOG_ID = ?`,
            [id]
        )
        // EMAIL OR NOTIFY BLOG USER WITH THE TEXTAREA
        const user = await SQLquery(`SELECT *
                                     FROM user
                                     WHERE USER_ID = ?`, [blog.BLOG_USER])
        // EMAIL OR NOTIFY BLOG USER WITH THE TEXTAREA

        await freeMail(user.NAME, user.EMAIL, `Hi, your post has been deleted, By an Admin`, `Your blog post has been deleted`)

        res.json({
            message: 'Post Deleted Successfully'
        })

    } catch (err) {
        console.log(err)
        res.status(500)
    }
});

router.post("/add-new-blog", upload.single("image"), async (req, res, next) => {
    try {
        // Validate input
        const {title, description, keywords, category, htmlEditor, action} =
            req.body;
        if (!title || !description || !category || !htmlEditor || !action) {
            return res.redirect("/vendor/blog?err=empty-fields");
        }
        const imageLink = `/BLOG_IMAGES/${req.file.filename}`;
        const blogId = `BLG_${randThisNum(1000000, 9999999)}`;
        const userId = req.session.user.USER_ID;
        const username = req.session.user.NAME;
        const userImage = req.session.user.PROFILE_IMAGE;

        // Use parameterized query to prevent SQL injection
        const query = `
            INSERT INTO blogs
            (BLOG_ID, BLOG_SLUG, BLOG_TITLE, BLOG_DESC, BLOG_CATEGORY, BLOG_POST, BLOG_IMAGE, BLOG_KEYWORDS, BLOG_USER,
             BLOG_USER_NAME, BLOG_USER_IMAGE, BLOG_STATUS, BLOG_ADMIN_STATUS, SEEN)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const status = action === "public" ? "active" : "inactive";
        const adminStatus =
            req.session.user.ROLE === "admin" ? "active" : "inactive";
        const data = [
            blogId,
            createSlug(title),
            title,
            description,
            category,
            escapeHtml(htmlEditor),
            imageLink,
            keywords,
            userId,
            username,
            userImage,
            status,
            adminStatus,
            "true"
        ];
        await SQLquery(query, data);
        res.redirect(`/${req.session.user.ROLE}/blog/views?action=${action}`);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post("/up-new-blog/:id", upload.single("image"), async (req, res) => {
    try {
        const {id} = req.params;
        const blog = await SQLquery(
            `SELECT *
             FROM blogs
             WHERE BLOG_ID = ?
               AND BLOG_USER = ? LIMIT 1`,
            [id, req.session.user.USER_ID]
        );

        if (!blog) return res.redirect("/admin/blog");

        const {filename} = req.file || {};
        const {title, description, Keywords, category, htmlEditor, action} =
            req.body;
        const imageLink = filename
            ? `/BLOG_IMAGES/${filename}`
            : blog[0].BLOG_IMAGE;
        const {USER_ID, NAME, PROFILE_IMAGE, ROLE} = req.session.user;
        const blogId = blog[0].BLOG_ID;
        const status = action === "public" ? "active" : "inactive";
        const adminStatus = ROLE === "admin" ? "active" : "inactive";
        const data = [
            blogId,
            createSlug(title),
            title,
            description,
            category,
            htmlEditor,
            imageLink,
            Keywords,
            USER_ID,
            NAME,
            PROFILE_IMAGE,
            status,
            adminStatus,
            "true",
            blog[0].BLOG_ID,
        ];
        const query = `
            UPDATE blogs
            SET BLOG_ID           = ?,
                BLOG_SLUG         = ?,
                BLOG_TITLE        = ?,
                BLOG_DESC         = ?,
                BLOG_CATEGORY     = ?,
                BLOG_POST         = ?,
                BLOG_IMAGE        = ?,
                BLOG_KEYWORDS     = ?,
                BLOG_USER         = ?,
                BLOG_USER_NAME    = ?,
                BLOG_USER_IMAGE   = ?,
                BLOG_STATUS       = ?,
                BLOG_ADMIN_STATUS = ?,
                SEEN              = ?
            WHERE BLOG_ID = ?
        `;
        const response = await SQLquery(query, data);

        if (response) {
            res.redirect(`/${ROLE}/blog/views?action=${action}`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while adding the blog");
    }
});

module.exports = router;
