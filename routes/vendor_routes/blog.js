const express = require('express');
const escapeHtml = require('escape-html');
const router = express.Router();
const mysqlPool = require("../../database/mysql");
const util = require('util');
const SQLquery = util.promisify(mysqlPool.query).bind(mysqlPool);
const randThisNum = require('../../configs/randomNumbers');
const multer = require('multer');
const createSlug = require('../../configs/slug');
const path = require('path');
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

router.get('/new', (req, res) => {
    res.render('vendor/new-blog')
})

router.get('/edit/:blog_id', async (req, res) => {
    const {blog_id} = req.params
    const blogs = await SQLquery(`SELECT *
                                  FROM blogs
                                  WHERE BLOG_ID = ?`, [blog_id])
    res.render('vendor/edit-blog', {blogData: blogs[0]})
})

router.get('/', checkUserStatus, async (req, res) => {
    const blogs = await SQLquery(`SELECT *
                                  FROM blogs
                                  WHERE BLOG_ADMIN_STATUS = ?`, ['inactive'])
    res.render('vendor/blog', {blogs})
})

router.get('/views', async (req, res, next) => {
    const {USER_ID} = req.session.user
    const blogs = await SQLquery(`SELECT *
                                  FROM blogs
                                  WHERE BLOG_USER = ?
                                  ORDER BY ID DESC`, [USER_ID])
    res.render('vendor/editblog', {blogs})
})

router.delete("/audit", async (req, res) => {
    try {

        const {id} = req.body;
        const {USER_ID} = req.session.user

        await SQLquery(
            `DELETE
             FROM blogs
             WHERE BLOG_ID = ?
               AND BLOG_USER = ?`,
            [id, USER_ID]
        )
        // EMAIL OR NOTIFY BLOG USER WITH THE TEXTAREA

        res.json({
            message: 'Post Deleted Successfully'
        })

    } catch (err) {
        console.log(err)
        res.status(500)
    }
});


router.post('/add-new-blog', upload.single('image'), async (req, res, next) => {
    try {
        // Validate input
        const {title, description, keywords, category, htmlEditor, action} = req.body;
        if (!title || !description || !category || !htmlEditor || !action) {
            return res.redirect('/vendor/blog?err=empty-fields')
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
        const status = action === 'public' ? 'active' : 'inactive';
        const adminStatus = req.session.user.ROLE === 'admin' ? 'active' : 'inactive';
        const data = [
            blogId,
            createSlug(title),
            title,
            description,
            category,
            htmlEditor,
            imageLink,
            keywords,
            userId,
            username,
            userImage,
            status,
            adminStatus,
            "false"
        ];
        await SQLquery(query, data);
        
        const allAdmins = await SQLquery(`SELECT *
                                          FROM user
                                          WHERE ROLE = ?`, ['admin'])
        for (admin of allAdmins) {
            const message = `a new blog has been added on medic apparels that needs your attention`
            const subject = `New Blog Post Added To Medic Aparrels`
            await freeMail(admin.ROLE, admin.EMAIL, message, subject)
        }

        res.redirect(`/${req.session.user.ROLE}/blog/views?action=${action}`);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.post('/up-new-blog/:id', upload.single('image'), async (req, res) => {
    try {
        const {id} = req.params
        const blog = await SQLquery(
            `SELECT *
             FROM blogs
             WHERE BLOG_ID = ?
               AND BLOG_USER = ? LIMIT 1`,
            [id, req.session.user.USER_ID]
        )

        if (!blog) return res.redirect('/vendor/blog');

        const {filename} = req.file || {};
        const {title, description, Keywords, category, htmlEditor, action} = req.body;
        const imageLink = filename ? `/BLOG_IMAGES/${filename}` : blog[0].BLOG_IMAGE;
        const {USER_ID, NAME, PROFILE_IMAGE, ROLE} = req.session.user;
        const blogId = blog[0].BLOG_ID;
        const status = action === 'public' ? 'active' : 'inactive';
        const adminStatus = ROLE === 'admin' ? 'active' : 'inactive';
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
            "false",
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

        const allAdmins = await SQLquery(`SELECT *
                                          FROM user
                                          WHERE ROLE = ?`, ['admin']);
        for (admin of allAdmins) {
            const message = `a new blog has been added on medic apparels that needs your attention`;
            const subject = `New Blog Post Added To Medic Aparrels`;
            await freeMail(admin.ROLE, admin.EMAIL, message, subject);
        }
        
        if (response) {
            res.redirect(`/${ROLE}/blog/views?action=${action}`);
        }

    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while adding the blog');
    }
});

function checkUserStatus(req, res, next) {
    const user = req.session.user;

    if (!user) {
        req.session.destroy();
        return res.redirect("/login");
    }

    const {VERIFICATION, ROLE} = req.session.user;

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


module.exports = router