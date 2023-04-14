const express = require('express');
const router = express.Router();
const createSlug = require('../../configs/slug')
const multer = require("multer")
const randThisNum = require('../../configs/randomNumbers')
const path = require('path')
const mysqlPool = require("../../database/mysql");
const util = require('util');
const SQLquery = util.promisify(mysqlPool.query).bind(mysqlPool);


function getMulterMiddleware(dest, prefix) {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, dest);
        },
        filename: function (req, file, cb) {
            const fileName = file.originalname;
            const ext = path.extname(fileName);
            const imageName = `${prefix}_${randThisNum(1000000, 9999999)}${ext}`;
            cb(null, imageName);
        },
    });

    return multer({ storage: storage });
}

const upload = getMulterMiddleware('public/PAGES/', 'PAGES');


router.post('/add-new-page', upload.single('image'), async (req, res) => {
    try {
        const { aboutTitle } = JSON.parse(req.body.fields)
        const { html } = req.body

        let filePath;
        if (req.file) {
            const { filename } = req.file;
            filePath = `/PAGES/${filename}`;
        }

        const checkAbout = await SQLquery(
            `SELECT * FROM pages WHERE PAGE_LINK = ?`,
            ['/about']
        )

        if (checkAbout.length > 0) {
            const pageImage = filePath || checkAbout[0].PAGE_IMAGE;
            await SQLquery(
                `UPDATE pages SET PAGE_LINK = ?, PAGE_TITLE = ?, PAGE_CONTENT = ?, PAGE_IMAGE = ?, PAGE_STATUS = ? WHERE PAGE_LINK = ?`,
                ['/about', aboutTitle, html, pageImage, 'ENABLED', '/about']
            )
        } else {
            await SQLquery(
                `INSERT INTO pages (PAGE_LINK, PAGE_TITLE, PAGE_CONTENT, PAGE_IMAGE, PAGE_STATUS) VALUES (?, ?, ?, ?, ?)`,
                ['/about', aboutTitle, html, filePath, 'ENABLED']
            )
        }

        res.json()
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Internal server error' })
    }
})





router.post('/verify-page', async (req, res) => {

    const { urlText } = req.body;

    const urlSlug = await createSlug(urlText);

    res.json({
        slug: urlSlug
    })

})

const team = getMulterMiddleware('public/TEAM_IMAGES/', 'TM');

router.post('/add-new-member', team.single('image'), async (req, res, next) => {
    const { team_name, team_role } = req.body
    const { filename } = req.file
    const filePath = `/TEAM_IMAGES/${filename}`;

    await SQLquery(`
        INSERT INTO teams (TEAM_NAME, TEAM_ROLE, TEAM_IMAGE, TEAM_ID)
        VALUES (?,?,?,?)
    `, [team_name, team_role, filePath, `TEAM_${randThisNum(10000, 99999)}`]
    )

    res.redirect(req.get('referer'))
})





module.exports = router;