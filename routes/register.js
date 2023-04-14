const express = require("express");
const randThisNum = require("../configs/randomNumbers");
const router = express.Router();
const mysqlPool = require("../database/mysql");
const welcomeEmail = require("../mailer/welcomeEmail");
const getHash = require("../configs/getHash");

router.post("/new-user", async (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    const userid = `USR_${randThisNum(1000000000, 9999999999)}`
    const otpkey = randThisNum(1000, 9999)
    const cardId = `CRD_${randThisNum(10000, 99999)}`

    console.log(req.body)

    if (!firstname || !lastname || !email || !password) {
        return res.json({
            message: 'Sorry one or more fields are not filled'
        })
    }

    let response = await new Promise((resolve, reject) => {
        const sql = `SELECT * FROM user WHERE EMAIL = ?`
        mysqlPool.query(sql, [email], (err, row) => {
            resolve(row)
        })
    })

    if (response.length > 0) {
        return res.json({
            message: `Sorry this user already exist`
        }).status(409)
    }

    const createNewUser = `INSERT INTO user(NAME, EMAIL, PASSWORD, USER_ID, ROLE, STATUS, VERIFICATION, OTP_KEY,ADMINSTATUS,  FOLLOWER_COUNT, CARD_ID, PROFILE_IMAGE) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`;

    let pass = getHash(password).trim()

    mysqlPool.query(createNewUser, [
        `${firstname} ${lastname}`,
        email,
        pass,
        userid,
        'user',
        'inactive',
        'false',
        otpkey,
        'active',
        0,
        cardId,
        '/IMAGES/placeholder.jpg'
    ], (err, rows) => {
        if (err) {
            console.error(err)
        }
    });

    const vID = getHash(cardId)
    const vLink = `${req.protocol}://${req.get('host')}/register/activate/${userid}?cardId=${vID}`;

    await welcomeEmail(firstname + ' ' + lastname, vLink, email);

    res.cookie('email', email, { expires: new Date(Date.now() + 86000), path: '/' }).json({
        link: `/register/success?email=${email}`
    })

});


router.get('/', (req, res) => {
    res.render('register')
})

router.get('/activate/:userid', (req, res, next) => {
    const { userid } = req.params
    const { cardId } = req.query

    mysqlPool.query(`SELECT * FROM user WHERE USER_ID = ?`, [userid], (err, rows) => {
        if (err) throw err

        const [user] = rows

        if (getHash(user.CARD_ID) == cardId) {

            mysqlPool.query(`UPDATE user SET STATUS = ?, VERIFICATION = ? WHERE USER_ID = ?`, ['active', 'true', userid], (err, rows) => {
                if (err) throw err
                res.redirect('/email-success')
            })

        }
    })

})

router.get('/success', (req, res) => {
    let { email } = req.query
    if (email) {
        let info = 'Account created successfully'
        let message = 'Please check the verification link sent to your inbox!'
        res.render('register-success', { info, message })
    } else {
        res.render('register')
    }
})

module.exports = router;
