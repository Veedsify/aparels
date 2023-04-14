1. Update Blog Post Method and Action in the vendor
2. Update blog/views in admin when you add vendor

Rating System:

const ratings = [3.5, 2.5, 1.4];
const overallRating = calculateOverallRating(ratings);
console.log(`Overall rating: ${overallRating}`);

function calculateOverallRating(ratings) {
// Find the minimum and maximum ratings
const minRating = Math.min(...ratings);
const maxRating = Math.max(...ratings);

// Calculate the range
const range = maxRating - minRating;

// Calculate the normalized values for each rating
const normalizedRatings = ratings.map(rating => (rating - minRating) / range);

// Calculate the average of the normalized ratings
const averageNormalizedRating = normalizedRatings.reduce((sum, rating) => sum + rating, 0) / normalizedRatings.length;

// Convert the average normalized rating to a scale of 1 to 5
const overallRating = averageNormalizedRating \* 4 + 1;

// Return the overall rating
return overallRating;
}

CREATE TABLE settings (
`ID` INT(11) PRIMARY KEY AUTO_INCREMENT,
`SITE_NAME` VARCHAR(225),
`SITE_FOOTER_DESC` VARCHAR(2225),
`SITE_LOGO` VARCHAR(225),
`HOME_IMAGE_1` VARCHAR(225),
`HOME_IMAGE_2` VARCHAR(225),
`HOME_TEXT_1` VARCHAR(225),
`HOME_TEXT_2` VARCHAR(225),
`HOME_MEN_IMAGE` VARCHAR(225),
`HOME_WOMEN_IMAGE` VARCHAR(225),
`HOME_MEN_TEXT` VARCHAR(225),
`HOME_WOMEN_TEXT` VARCHAR(225),
`HOME_LATEST_TEXT` VARCHAR(225),
`HOME_LATEST_DESC` VARCHAR(225),
`HOME_PARALAX_IMAGE` VARCHAR(225),
`HOME_PARALAX_TEXT1` VARCHAR(225),
`HOME_PARALAX_TEXT2` VARCHAR(225),
`HOME_PARALAX_TEXT3` VARCHAR(225),
`FOOTER_ADDRESS` VARCHAR(225),
`FOOTER_PHONE_CONTACT` VARCHAR(225),
`FOOTER_EMAIL_CONTACT` VARCHAR(225),
`FOOTER_FACEBOOK` VARCHAR(225),
`FOOTER_GOOGLE` VARCHAR(225),
`FOOTER_TWITTER` VARCHAR(225),
`FOOTER_GOOGLE` VARCHAR(225),
`FOOTER_INSTAGRAM` VARCHAR(225),
`SUPPORT_EMAIL_1` VARCHAR(225),
`SUPPORT_EMAIL_2` VARCHAR(225),
`SUPPORT_PHONE` VARCHAR(225),
`SHIPPING_INFO` VARCHAR(225)
)

SITE_NAME
SITE_FOOTER_DESC
SITE_LOGO
HOME_IMAGE_1
HOME_IMAGE_2
HOME_TEXT_1
HOME_TEXT_2
HOME_TEXT_3
HOME_TEXT_4
HOME_MEN_IMAGE
HOME_WOMEN_IMAGE
HOME_MEN_TEXT
HOME_WOMEN_TEXT
HOME_LATEST_TEXT
HOME_LATEST_DESC
HOME_PARALAX_IMAGE
HOME_PARALAX_TEXT1
HOME_PARALAX_TEXT2
HOME_PARALAX_TEXT3
FOOTER_ADDRESS
FOOTER_PHONE_CONTACT
FOOTER_EMAIL_CONTACT
FOOTER_FACEBOOK
FOOTER_GOOGLE
FOOTER_TWITTER
FOOTER_INSTAGRAM
SUPPORT_EMAIL_1
SUPPORT_EMAIL_2
SUPPORT_PHONE
SHIPPING_INFO

name="siteName"
name="siteDesc"
name="siteLogo"
name="homeBannerImage1"
name="homeBannerText1"
name="homeBannerText2"
name="secondBannerImage"
name="secondBannerText1"
name="secondBannerText2"
name="homeFeaturedIMage"
name="homeFeaturedText1"
name="homeFeaturedIMage2"
name="homeFeaturedText2"
name="homeLatestText"
name="homeLatestDesc"
name="homeParalaxImage"
name="homeParalaxText1"
name="homeParalaxText2"
name="homeParalaxText3"
name="footerAddress"
name="footerPhone"
name="footerEmail"
name="footerFacebook"
name="footerGoogle"
name="footerTwitter"
name="footerInstagram"
name="supportEmail1"
name="supportEmail2"
name="supportPhone"
name="shippingInfo"

const express = require('express');
const multer = require('multer');
const mysql = require('mysql2');
const app = express();

// Set storage options for Multer
const storage = multer.diskStorage({
destination: function (req, file, cb) {
cb(null, 'uploads/')
},
filename: function (req, file, cb) {
const inputName = file.fieldname; // get the input name
const originalName = file.originalname; // get the original file name
const fileName = `${inputName}_${originalName}`; // construct the file name
cb(null, fileName);
}
})

// Create upload middleware for Multer
const upload = multer({ storage: storage });

// Create MySQL connection
const connection = mysql.createConnection({
host: 'localhost',
user: 'root',
password: 'password',
database: 'mydatabase'
});

// Handle POST request with file upload
app.post('/upload', upload.fields([
{ name: 'image1' },
{ name: 'image2' },
{ name: 'image3' }
]), (req, res) => {
const { name, email } = req.body;
const files = req.files;

// Insert data into MySQL database
let values = [];
let sql = 'INSERT INTO users (name, email, image1, image2, image3) VALUES (?, ?, ?, ?, ?)';
values.push(name, email);
Object.keys(files).forEach(key => {
const file = files[key][0];
if (file !== undefined) {
values.push(file.filename);
} else {
values.push(null);
}
});

connection.query(sql, values, (error, results) => {
if (error) {
console.log(error);
res.sendStatus(500);
} else {
res.send('File uploaded and data inserted into the database successfully!');
}
});
});

app.listen(3000, () => {
console.log('Server started on port 3000');
});

[
  {
    "fieldname": "siteLogo",
    "originalname": "monika-kesharwani-70g-y92y_Hw-unsplash.jpg",
    "encoding": "7bit",
    "mimetype": "image/jpeg",
    "destination": "public/PAGES/",
    "filename": "siteLogo.jpg",
    "path": "public\\PAGES\\siteLogo.jpg",
    "size": 2834667
  },
  {
    "fieldname": "homeBannerImage1",
    "originalname": "suheyl-burak-p7I07kuPSyU-unsplash.jpg",
    "encoding": "7bit",
    "mimetype": "image/jpeg",
    "destination": "public/PAGES/",
    "filename": "homeBannerImage1.jpg",
    "path": "public\\PAGES\\homeBannerImage1.jpg",
    "size": 967931
  },
  {
    "fieldname": "secondBannerImage",
    "originalname": "image (1).png",
    "encoding": "7bit",
    "mimetype": "image/png",
    "destination": "public/PAGES/",
    "filename": "secondBannerImage.png",
    "path": "public\\PAGES\\secondBannerImage.png",
    "size": 161850
  },
  {
    "fieldname": "homeFeaturedIMage",
    "originalname": "shcvc.png",
    "encoding": "7bit",
    "mimetype": "image/png",
    "destination": "public/PAGES/",
    "filename": "homeFeaturedIMage.png",
    "path": "public\\PAGES\\homeFeaturedIMage.png",
    "size": 168088
  },
  {
    "fieldname": "homeFeaturedIMage2",
    "originalname": "National ID.jpg",
    "encoding": "7bit",
    "mimetype": "image/jpeg",
    "destination": "public/PAGES/",
    "filename": "homeFeaturedIMage2.jpg",
    "path": "public\\PAGES\\homeFeaturedIMage2.jpg",
    "size": 29651
  },
  {
    "fieldname": "homeParalaxImage",
    "originalname": "fluxweed-hcpsKre3rO8-unsplash.jpg",
    "encoding": "7bit",
    "mimetype": "image/jpeg",
    "destination": "public/PAGES/",
    "filename": "homeParalaxImage.jpg",
    "path": "public\\PAGES\\homeParalaxImage.jpg",
    "size": 2058817
  }
]


<!-- NOTES -->

Work on shop page / 50% fixed
update profile address settings for user
Complete shipping, policy, contact page,
work on email templates
