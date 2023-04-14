const express = require('express')
const router = express.Router()
const mysqlPool = require("../../database/mysql");
const util = require('util');
const randThisNum = require('../../configs/randomNumbers')
const SQLquery = util.promisify(mysqlPool.query).bind(mysqlPool);

router.get('/', async (req, res) => {
    const users = await SQLquery(`SELECT * FROM user WHERE NOT USER_ID = ? AND ROLE = ?`, ['USR_7079118447', 'user'])
    res.render('vendor/users', { users })
})

router.get('/roles', (req, res) => {
    res.render('vendor/roles')
})

router.get('/vendors', async (req, res) => {
    const vendors = await SQLquery(`SELECT * FROM user WHERE NOT USER_ID = ? AND ROLE = ?`, ['USR_7079118447', 'vendor'])

    res.render('vendor/vendors', { vendors, vendorsLength: vendors.length })
})

router.post('/vendors/status', async (req, res) => {
    const { vendorID, action } = req.body

    if (action == 'ban') {
        await SQLquery(`UPDATE user SET ADMINSTATUS = ? WHERE USER_ID = ?`, [
            'inactive',
            vendorID
        ])
    }
    if (action == 'activate') {
        await SQLquery(`UPDATE user SET ADMINSTATUS = ? WHERE USER_ID = ?`, [
            'active',
            vendorID
        ])
    }
    if (action == 'delete') {
        await SQLquery(`DELETE FROM user WHERE USER_ID = ?`, [
            vendorID
        ])
    }
    res.json({})
})

router.post('/vendor/create', async (req, res) => {
    const { vendor_name, vendor_password, vendor_email } = req.body

    if (req.session.user.ROLE == 'admin') {

        const { firstname, lastname, email, password } = req.body;
        const userid = `USR_${randThisNum(1000000000, 9999999999)}`
        const otpkey = randThisNum(1000, 9999)
        const cardId = `CRD_${randThisNum(10000, 99999)}`

        console.log(req.body)

        if (!vendor_email || !vendor_name || !vendor_password) {
            return console.log({
                message: 'Sorry one or more fields are not filled'
            })
        }

        let response = await new Promise((resolve, reject) => {
            const sql = `SELECT * FROM user WHERE EMAIL = ?`
            mysqlPool.query(sql, [vendor_email], (err, row) => {
                resolve(row)
            })
        })

        if (response.length > 0) {
            return console.log({
                message: `Sorry this user already exist`
            })
        }

        const createNewUser = `INSERT INTO user(NAME, EMAIL, PASSWORD, USER_ID, VENDOR_NAME, ROLE, STATUS, VERIFICATION, OTP_KEY,ADMINSTATUS,  FOLLOWER_COUNT, CARD_ID, PROFILE_IMAGE) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`;

        await SQLquery(createNewUser, [
            vendor_name,
            vendor_email,
            vendor_password,
            userid,
            vendor_name,
            'vendor',
            'inactive',
            'false',
            otpkey,
            'active',
            0,
            cardId,
            '/IMAGES/placeholder.jpg'
        ]);

        res.redirect(`/${req.session.user.ROLE}/user/vendors?message=success`)

    } else {
        res.redirect('/unauthorized')
    }
})

router.post('/get-data', (req, res) => {
    res.json({
        fullname: 'Dan Morris',
        image: '/IMAGES/test.jpg'
    })
})

router.post('/update', (req, res) => {
    res.redirect('/admin/user?updated=true&role=admin')
})


router.post('/get-user-data', async (req, res) => {
    const { userData } = req.body
    const user = await SQLquery(
        `SELECT * FROM user WHERE USER_ID = ?`,
        [userData]
    )
    res.json({ user: user[0] })

})

router.post('/status/:userId', async (req, res) => {
    const { userId } = req.params
    const { status } = req.body
    const user = await SQLquery(
        `UPDATE user SET  ADMINSTATUS = ? WHERE USER_ID = ?`,
        [status, userId]
    )

    res.redirect(`/${req.session.user.ROLE}/user`)
})

router.delete('/status', async (req, res) => {
    const { userid } = req.body
    const user = await SQLquery(
        `DELETE FROM user WHERE USER_ID = ?`,
        [userid]
    )
    res.json({ message: 'successful' })
})
module.exports = router