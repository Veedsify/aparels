const express = require("express");
const router = express.Router();
const mysqlPool = require("../../database/mysql");
const getHash = require("../../configs/getHash");
const util = require('util');
const multer = require("multer");
const SQLquery = util.promisify(mysqlPool.query).bind(mysqlPool);
const path = require('path');

router.get("/", (req, res, next) => {
    let user = req.session.user;
    res.render("admin/profile", { user });
});

router.post("/address", async (req, res) => {
    try {
        const { country, state, city, address, postalcode } = req.body;
        const { user } = req.session;
        const { USER_ID } = user;
        const refererUrl = req.headers.referer;

        await SQLquery(
            `
      UPDATE user SET COUNTRY = ?, STATE = ?, CITY = ?, ADDRESS = ?, ZIP_CODE = ?
      WHERE USER_ID = ?
      `,
            [country, state, city, address, postalcode, USER_ID]
        );

        const updatedUser = {
            ...user,
            COUNTRY: country,
            STATE: state,
            CITY: city,
            ADDRESS: address,
            ZIP_CODE: postalcode,
        };

        req.session.user = updatedUser;

        res.redirect(`/admin/profile?update=successful`);
    } catch (error) {
        console.error(error);
        res.redirect(refererUrl);
    }
});

router.post("/details", async (req, res) => {
    const refererUrl = req.headers.referer;
    try {
        const { fullname, email, phone, password } = req.body;
        const { user } = req.session;
        const { USER_ID, PASSWORD } = user;

        let pass = getHash(password.trim())

        console.log(password)

        if (pass !== PASSWORD) { // Fixed condition
            return res.redirect(`/admin/profile?password=error`)
        }

        await SQLquery(
            `
            UPDATE user SET NAME = ?, EMAIL = ?, PHONE = ?
            WHERE USER_ID = ? AND PASSWORD = ? 
            `,
            [fullname, email, phone, USER_ID, pass]
        );

        const updatedUser = {
            ...user,
            NAME: fullname,
            EMAIL: email,
            PHONE: phone,
        };

        req.session.user = updatedUser;

        res.redirect(`/admin/profile?update=successful`);

    } catch (error) {
        console.error(error);
        res.redirect(refererUrl);
    }
});

router.post('/more-info', async (req, res) => {

    try {
        const { instagramLink, twitterLink, facebookLink, vendorDesc, vendorName, showVendor } = req.body
        const { user } = req.session;
        const { USER_ID, PASSWORD } = user;

        await SQLquery(
            `
      UPDATE user SET VENDOR_NAME = ?, VENDOR_DESC = ?, FACEBOOK_LINK = ?, TWITTER_LINK =?, INSTAGRAM_LINK =?, VENDOR_VISIBLE = ?
      WHERE USER_ID = ? AND PASSWORD = ? 
      `,
            [vendorName, vendorDesc, facebookLink, twitterLink, instagramLink, showVendor, USER_ID, PASSWORD]
        );

        const updatedUser = {
            ...user,
            VENDOR_NAME: vendorName,
            VENDOR_DESC: vendorDesc,
            FACEBOOK_LINK: facebookLink,
            TWITTER_LINK: twitterLink,
            INSTAGRAM_LINK: instagramLink,
            VENDOR_VISIBLE: "true",
        };

        req.session.user = updatedUser;

        res.redirect(`/admin/profile?update=successful`)
    } catch (error) {
        return console.log(error)
    }
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/USER_IMAGES/");
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname;
        const ext = path.extname(fileName);
        const imageName = `${req.session.user.USER_ID}${ext}`;
        cb(null, imageName);
    },
});


const upload = multer({ storage: storage });

router.post("/image", upload.single("image"), async (req, res) => {
    const { USER_ID } = req.session.user;
    const { filename } = req.file;
    const imagePath = `/USER_IMAGES/${filename}`;
    const sql =
        `UPDATE user SET PROFILE_IMAGE = ? WHERE USER_ID = ?;
        UPDATE blogcomments SET USER_IMAGE = ? WHERE USER_ID = ?;
        `;
    const response = await mysqlPool.query(sql, [
        imagePath,
        USER_ID,
        imagePath,
        USER_ID
    ]);

    // UPADTE ALL INSTANCES OF THIS USER IMAGHE IN THE DATABASE

    req.session.user.PROFILE_IMAGE = imagePath;
    res.status(200).json({ imagePath });
});

module.exports = router;
