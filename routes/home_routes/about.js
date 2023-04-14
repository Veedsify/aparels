const express = require('express');
const router = express.Router();
const mysqlPool = require("../../database/mysql");
const util = require('util');
const SQLquery = util.promisify(mysqlPool.query).bind(mysqlPool);

router.get('/', async (req, res) => {
    const data = await SQLquery(
        `SELECT * FROM pages WHERE PAGE_LINK = ?`,
        ['/about']
    )
    const teams = await SQLquery(
        `SELECT * FROM teams ORDER BY ID DESC`,
    )
    res.render('home/about-us', { data: data[0], teams })
})

// router.post('/update-about', (req, res) => {

//     const { aboutContent } = req.body

//     try{
//         await SQLquery('INSERT INTO pages (PAGE_LINK, PAGE_CONTENT, PAGE_IMAGE, PAGE_STATUS) ')
//     }

// })


module.exports = router