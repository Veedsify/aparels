const express = require('express');
const router = express.Router();
const mysqlPool = require("../../database/mysql");
const util = require('util');
const SQLquery = util.promisify(mysqlPool.query).bind(mysqlPool);


router.get('/', async (req, res) => {
    let blogs = await SQLquery(`SELECT * FROM blogs WHERE BLOG_STATUS = ? AND BLOG_ADMIN_STATUS = ? ORDER BY ID DESC LIMIT 5`, ['active', 'active'])
    res.render('home/blog', { blogs })
})

router.get('/:article', async (req, res) => {
    const { article } = req.params;

    try {
        const [blog] = await SQLquery(`SELECT * FROM blogs WHERE BLOG_SLUG = ?`, [article]);

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



module.exports = router