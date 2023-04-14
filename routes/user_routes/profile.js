const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const mysqlPool = require("../../database/mysql");
const util = require('util');
const SQLquery = util.promisify(mysqlPool.query).bind(mysqlPool);

router.get('/', (req, res) => {
    res.render('user/profile')
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

    const response = await SQLquery(sql, [
        imagePath,
        USER_ID,
        imagePath,
        USER_ID
    ]);

    // UPADTE ALL INSTANCES OF THIS USER IMAGHE IN THE DATABASE

    req.session.user.PROFILE_IMAGE = imagePath;
    res.status(200).json({ imagePath });
});

module.exports = router