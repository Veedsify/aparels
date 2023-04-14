const express = require('express');
const router = express.Router();
const mysqlPool = require("../../database/mysql");
const util = require('util');
const SQLquery = util.promisify(mysqlPool.query).bind(mysqlPool);

router.get('/become-a-seller', async (req, res) => {
    res.render('home/seller')
})

router.get('/:id', async (req, res) => {
    const [data] = await SQLquery(
        `SELECT * FROM pages WHERE PAGE_LINK = ?`,
        [req.params.id]
    )
   
    res.render('home/pages', { data })
})



router.post('/become-a-seller', async (req, res) => {
    // EMAIL ADDMIN ABOUT SELLER
    const { address, firstname, lastname, phone, message, email } = req.body
    
    if (address) return res.redirect('/pages/become-a-seller?error=spam')

    // EMAIL the USER
    res.redirect('/pages/become-a-seller')

})

module.exports = router