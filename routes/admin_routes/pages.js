const express = require("express");
const router = express.Router();
const createSlug = require("../../configs/slug");
const multer = require("multer");
const escapeHtml = require("escape-html");
const randThisNum = require("../../configs/randomNumbers");
const path = require("path");
const mysqlPool = require("../../database/mysql");
const util = require("util");
const jsondb = require("../../jsondb/jsondb");
const SQLquery = util.promisify(mysqlPool.query).bind(mysqlPool);
const { v4: uuidv4 } = require("uuid");


function getMulterMiddleware(dest, prefix) {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, dest);
        },
        filename: function (req, file, cb) {
            const fileName = file.originalname;
            const ext = path.extname(fileName);
            const imageName = `${prefix}_${uuidv4()}${ext}`;
            cb(null, imageName);
        },
    });

    return multer({ storage: storage });
}

const upload = getMulterMiddleware("public/PAGES/", "PAGES");


router.post("/add-new-page", upload.single("image"), async (req, res) => {
    try {
        const { aboutTitle } = JSON.parse(req.body.fields);

        const { html } = req.body;

        let filePath;
        if (req.file) {
            const { filename } = req.file;
            filePath = `/PAGES/${filename}`;
        }

        const checkAbout = await SQLquery(
            `SELECT * FROM pages WHERE PAGE_LINK = ?`,
            ["/about"]
        );

        if (checkAbout.length > 0) {
            const pageImage = filePath || checkAbout[0].PAGE_IMAGE;
            await SQLquery(
                `UPDATE pages SET PAGE_LINK = ?, PAGE_TITLE = ?, PAGE_CONTENT = ?, PAGE_IMAGE = ?, PAGE_STATUS = ? WHERE PAGE_LINK = ?`,
                ["/about", aboutTitle, html, pageImage, "ENABLED", "/about"]
            );
        } else {
            await SQLquery(
                `INSERT INTO pages (PAGE_LINK, PAGE_TITLE, PAGE_CONTENT, PAGE_IMAGE, PAGE_STATUS) VALUES (?, ?, ?, ?, ?)`,
                ["/about", aboutTitle, escapeHtml(html), filePath, "ENABLED"]
            );
        }

        res.json();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/add-privacy-page", upload.single("image"), async (req, res) => {
    try {
        const { aboutTitle, page } = JSON.parse(req.body.fields);
        const { html } = req.body;

        let filePath;
        if (req.file) {
            const { filename } = req.file;
            filePath = `/PAGES/${filename}`;
        }

        const checkAbout = await SQLquery(
            `SELECT * FROM pages WHERE PAGE_LINK = ?`,
            [page]
        );

        if (checkAbout.length > 0) {
            const pageImage = filePath || checkAbout[0].PAGE_IMAGE;
            await SQLquery(
                `UPDATE pages SET PAGE_LINK = ?, PAGE_TITLE = ?, PAGE_CONTENT = ?, PAGE_IMAGE = ?, PAGE_STATUS = ? WHERE PAGE_LINK = ?`,
                [page, aboutTitle, html, pageImage, "ENABLED", page]
            );
        } else {
            await SQLquery(
                `INSERT INTO pages (PAGE_LINK, PAGE_TITLE, PAGE_CONTENT, PAGE_IMAGE, PAGE_STATUS) VALUES (?, ?, ?, ?, ?)`,
                [page, aboutTitle, escapeHtml(html), filePath, "ENABLED"]
            );
        }

        res.json();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// router.post("/add-new-page", upload.single("image"), async (req, res) => {
//     try {
//         const { aboutTitle } = JSON.parse(req.body.fields);
//         const { html } = req.body;

//         let filePath;
//         if (req.file) {
//             const { filename } = req.file;
//             filePath = `/PAGES/${filename}`;
//         }

//         const checkAbout = await SQLquery(
//             `SELECT * FROM pages WHERE PAGE_LINK = ?`,
//             ["/about"]
//         );

//         if (checkAbout.length > 0) {
//             const pageImage = filePath || checkAbout[0].PAGE_IMAGE;
//             await SQLquery(
//                 `UPDATE pages SET PAGE_LINK = ?, PAGE_TITLE = ?, PAGE_CONTENT = ?, PAGE_IMAGE = ?, PAGE_STATUS = ? WHERE PAGE_LINK = ?`,
//                 ["/about", aboutTitle, html, pageImage, "ENABLED", "/about"]
//             );
//         } else {
//             await SQLquery(
//                 `INSERT INTO pages (PAGE_LINK, PAGE_TITLE, PAGE_CONTENT, PAGE_IMAGE, PAGE_STATUS) VALUES (?, ?, ?, ?, ?)`,
//                 ["/about", aboutTitle, escapeHtml(html), filePath, "ENABLED"]
//             );
//         }

//         res.json();
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Internal server error" });
//     }
// });

router.post("/verify-page", async (req, res) => {
    const { urlText } = req.body;

    const urlSlug = await createSlug(urlText);

    res.json({
        slug: urlSlug,
    });
});

const team = getMulterMiddleware("public/TEAM_IMAGES/", "TM");

router.post("/add-new-member", team.single("image"), async (req, res, next) => {
    const { team_name, team_role } = req.body;
    const { filename } = req.file;
    const filePath = `/TEAM_IMAGES/${filename}`;

    await SQLquery(
        `
        INSERT INTO teams (TEAM_NAME, TEAM_ROLE, TEAM_IMAGE, TEAM_ID)
        VALUES (?,?,?,?)
    `,
        [team_name, team_role, filePath, `TEAM_${randThisNum(10000, 99999)}`]
    );

    res.redirect(req.get("referer"));
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/PAGES/");
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname;
        const inputName = file.fieldname
        const ext = path.extname(fileName);
        const imageName = `${inputName}${ext}`;
        cb(null, imageName);
    },
});


const homeUpload = multer({ storage: storage });

router.post('/home', homeUpload.fields([
    { name: 'siteLogo' },
    { name: 'homeBannerImage1' },
    { name: 'secondBannerImage' },
    { name: 'homeFeaturedIMage' },
    { name: 'homeFeaturedIMage2' },
    { name: 'homeParalaxImage' },

]), async (req, res) => {

    try {
        const {
            siteName,
            siteDesc,
            siteLogo,
            homeBannerImage1,
            homeBannerText1,
            homeBannerText2,
            secondBannerImage,
            secondBannerText1,
            secondBannerText2,
            homeFeaturedIMage,
            homeFeaturedText1,
            homeFeaturedIMage2,
            homeFeaturedText2,
            homeLatestText,
            homeLatestDesc,
            homeParalaxImage,
            homeParalaxText1,
            homeParalaxText2,
            homeParalaxText3,
            footerAddress,
            footerPhone,
            footerEmail,
            footerFacebook,
            footerGoogle,
            footerTwitter,
            footerInstagram,
            supportEmail1,
            supportEmail2,
            supportPhone,
            shippingInfo
        } = req.body

        const [data] = await SQLquery(`SELECT * FROM settings LIMIT 1`)

        const obj1 = req.files.siteLogo?.[0] ?? null;
        const obj2 = req.files.homeBannerImage1?.[0] ?? null;
        const obj3 = req.files.secondBannerImage?.[0] ?? null;
        const obj4 = req.files.homeFeaturedIMage?.[0] ?? null;
        const obj5 = req.files.homeFeaturedIMage2?.[0] ?? null;
        const obj6 = req.files.homeParalaxImage?.[0] ?? null;

        const VsiteLogo = obj1 && obj1 !== null ? `/PAGES/${obj1.filename}` : data.SITE_LOGO;
        const VhomeBannerImage1 = obj2 && obj2 !== null ? `/PAGES/${obj2.filename}` : data.HOME_IMAGE_1;
        const VsecondBannerImage = obj3 && obj3 !== null ? `/PAGES/${obj3.filename}` : data.HOME_IMAGE_2;
        const VhomeFeaturedImage = obj4 && obj4 !== null ? `/PAGES/${obj4.filename}` : data.HOME_MEN_IMAGE;
        const VhomeFeaturedImage2 = obj5 && obj5 !== null ? `/PAGES/${obj5.filename}` : data.HOME_WOMEN_IMAGE;
        const VhomeParalaxImage = obj6 && obj6 !== null ? `/PAGES/${obj6.filename}` : data.HOME_PARALAX_IMAGE;


        let VsiteName = siteName && siteName !== '' ? siteName : data.SITE_NAME
        let VsiteDesc = siteDesc && siteDesc !== '' ? siteDesc : data.SITE_FOOTER_DESC
        let VhomeBannerText1 = homeBannerText1 && homeBannerText1 !== '' ? homeBannerText1 : data.HOME_TEXT_1
        let VhomeBannerText2 = homeBannerText2 && homeBannerText2 !== '' ? homeBannerText2 : data.HOME_TEXT_2
        let VsecondBannerText1 = secondBannerText1 && secondBannerText1 !== '' ? secondBannerText1 : data.HOME_TEXT_3
        let VsecondBannerText2 = secondBannerText2 && secondBannerText2 !== '' ? secondBannerText2 : data.HOME_TEXT_4
        let VhomeFeaturedText1 = homeFeaturedText1 && homeFeaturedText1 !== '' ? homeFeaturedText1 : data.HOME_MEN_TEXT
        let VhomeFeaturedText2 = homeFeaturedText2 && homeFeaturedText2 !== '' ? homeFeaturedText2 : data.HOME_WOMEN_TEXT
        let VhomeLatestText = homeLatestText && homeLatestText !== '' ? homeLatestText : data.HOME_LATEST_TEXT
        let VhomeLatestDesc = homeLatestDesc && homeLatestDesc !== '' ? homeLatestDesc : data.HOME_LATEST_DESC
        let VhomeParalaxText1 = homeParalaxText1 && homeParalaxText1 !== '' ? homeParalaxText1 : data.HOME_PARALAX_TEXT1
        let VhomeParalaxText2 = homeParalaxText2 && homeParalaxText2 !== '' ? homeParalaxText2 : data.HOME_PARALAX_TEXT2
        let VhomeParalaxText3 = homeParalaxText3 && homeParalaxText3 !== '' ? homeParalaxText3 : data.HOME_PARALAX_TEXT3
        let VfooterAddress = footerAddress && footerAddress !== '' ? footerAddress : data.FOOTER_ADDRESS
        let VfooterPhone = footerPhone && footerPhone !== '' ? footerPhone : data.FOOTER_PHONE_CONTACT
        let VfooterEmail = footerEmail && footerEmail !== '' ? footerEmail : data.FOOTER_EMAIL_CONTACT
        let VfooterFacebook = footerFacebook && footerFacebook !== '' ? footerFacebook : data.FOOTER_FACEBOOK
        let VfooterGoogle = footerGoogle && footerGoogle !== '' ? footerGoogle : data.FOOTER_GOOGLE
        let VfooterTwitter = footerTwitter && footerTwitter !== '' ? footerTwitter : data.FOOTER_TWITTER
        let VfooterInstagram = footerInstagram && footerInstagram !== '' ? footerInstagram : data.FOOTER_INSTAGRAM
        let VsupportEmail1 = supportEmail1 && supportEmail1 !== '' ? supportEmail1 : data.SUPPORT_EMAIL_1
        let VsupportEmail2 = supportEmail2 && supportEmail2 !== '' ? supportEmail2 : data.SUPPORT_EMAIL_2
        let VsupportPhone = supportPhone && supportPhone !== '' ? supportPhone : data.SUPPORT_PHONE
        let VshippingInfo = shippingInfo && shippingInfo !== '' ? shippingInfo : data.SHIPPING_INFO

        let sql = `
    UPDATE settings SET
    SITE_LOGO = ?,
    HOME_IMAGE_1 = ?,
    HOME_IMAGE_2 = ?,
    HOME_MEN_IMAGE = ?,
    HOME_WOMEN_IMAGE = ?,
    HOME_PARALAX_IMAGE = ?,
    SITE_NAME = ?,
    SITE_FOOTER_DESC = ?,
    HOME_TEXT_1 = ?,
    HOME_TEXT_2 = ?,
    HOME_TEXT_3 = ?,
    HOME_TEXT_4 = ?,
    HOME_MEN_TEXT = ?,
    HOME_WOMEN_TEXT = ?,
    HOME_LATEST_TEXT = ?,
    HOME_LATEST_DESC = ?,
    HOME_PARALAX_TEXT1 = ?,
    HOME_PARALAX_TEXT2 = ?,
    HOME_PARALAX_TEXT3 = ?,
    FOOTER_ADDRESS = ?,
    FOOTER_PHONE_CONTACT = ?,
    FOOTER_EMAIL_CONTACT = ?,
    FOOTER_FACEBOOK = ?,
    FOOTER_GOOGLE = ?,
    FOOTER_TWITTER = ?,
    FOOTER_INSTAGRAM = ?,
    SUPPORT_EMAIL_1 = ?,
    SUPPORT_EMAIL_2 = ?,
    SUPPORT_PHONE = ?,
    SHIPPING_INFO = ? WHERE ID = ?  `

        const updateData = [
            VsiteLogo,
            VhomeBannerImage1,
            VsecondBannerImage,
            VhomeFeaturedImage,
            VhomeFeaturedImage2,
            VhomeParalaxImage,
            VsiteName,
            VsiteDesc,
            VhomeBannerText1,
            VhomeBannerText2,
            VsecondBannerText1,
            VsecondBannerText2,
            VhomeFeaturedText1,
            VhomeFeaturedText2,
            VhomeLatestText,
            VhomeLatestDesc,
            VhomeParalaxText1,
            VhomeParalaxText2,
            VhomeParalaxText3,
            VfooterAddress,
            VfooterPhone,
            VfooterEmail,
            VfooterFacebook,
            VfooterGoogle,
            VfooterTwitter,
            VfooterInstagram,
            VsupportEmail1,
            VsupportEmail2,
            VsupportPhone,
            VshippingInfo,
            1
        ]

        if (await SQLquery(sql, updateData)) {
            res.redirect('/admin/configuration/pages/home?updateData=true')
        }

    } catch (err) {
        throw new Error(err);
    }

})

module.exports = router;
