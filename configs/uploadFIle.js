const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/PRODUCT_IMAGES/');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname;
        const ext = path.extname(fileName);
        const imageName = `PIMG_${randThisNum(10000000, 99999999)}${ext}`
        cb(null, imageName);
    }
});

const uploadFile = multer({ storage: storage });

module.exports = { uploadFile }

