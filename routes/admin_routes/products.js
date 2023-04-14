const express = require("express");
const escapeHtml = require('escape-html');
const router = express.Router();
const multer = require("multer");
const path = require("path");
const randThisNum = require("../../configs/randomNumbers");
const createSlug = require("../../configs/slug");
const mysqlPool = require("../../database/mysql");
const util = require("util");
const SQLquery = util.promisify(mysqlPool.query).bind(mysqlPool);

// PRODUCT ID
var prd = `PRD_${randThisNum(10000000000, 99999999999)}`;

router.get("/", async (req, res) => {
  const { USER_ID } = req.session.user;
  const myProducts = await new Promise((resolve, reject) => {
    const sql = "SELECT * FROM products WHERE PRODUCT_USER = ?";
    mysqlPool.query(sql, [USER_ID], (err, rows) => {
      if (err) throw err;
      resolve(rows);
    });
  });
  res.render("admin/product", { myProducts });
});

router.get('/edit/:id', async (req, res, next) => {
  const { id } = req.params
  const { USER_ID } = req.session.user;

  const myCategories = await new Promise((resolve, reject) => {
    const sql = "SELECT * FROM category";
    mysqlPool.query(sql, (err, rows) => {
      if (err) throw err;
      resolve(rows);
    });
  });
  const [product] = await SQLquery(`SELECT * FROM products WHERE PRODUCT_ID =? AND PRODUCT_USER = ?`, [id, USER_ID])

  res.render("admin/edit-products", { product, myCategories });

})

router.get("/detail", (req, res, next) => {
  res.render("admin/product-detail");
});

router.get("/add", async (req, res) => {
  const user = req.session.user;
  const myCategories = await new Promise((resolve, reject) => {
    const sql = "SELECT * FROM category WHERE USER_ID = ?";
    mysqlPool.query(sql, [user.USER_ID], (err, rows) => {
      if (err) throw err;
      resolve(rows);
    });
  });
  res.render("admin/add-products", { user, myCategories });
});

// Get a user s category
router.get("/category", (req, res, next) => {
  const { USER_ID } = req.session.user;
  mysqlPool.query(
    "SELECT * FROM category",
    [USER_ID],
    (err, rows) => {
      if (err) throw err;
      res.render("admin/category", { category: rows });
    }
  );
});

router.get("/approve", async (req, res, next) => {
  const products = await SQLquery("SELECT * FROM products WHERE ADMIN_STATUS  = ? AND ADMIN_SEEN = ? ", ['DISABLED', 'FALSE'])
  res.render("admin/product-grid", { products });
});

router.get("/approve/view/:id", async (req, res, next) => {
  const { id } = req.params
  const [product] = await SQLquery("SELECT * FROM products WHERE PRODUCT_ID  = ?", [id])
  res.render("admin/product-detail", { product });
});

router.put('/status', async (req, res) => {
  const { productId } = req.body
  await SQLquery(`UPDATE products SET ADMIN_STATUS = ?, ADMIN_SEEN = ? WHERE PRODUCT_ID = ?`, ['ENABLED', 'TRUE', productId])
  console.log(productId)
  // EMAIL USER
  res.status(200).json({ productId })
})

router.post('/status', async (req, res) => {
  const { productId } = req.body
  await SQLquery(`UPDATE products SET ADMIN_STATUS = ?, ADMIN_SEEN = ? WHERE PRODUCT_ID = ?`, ['DISABLED', 'TRUE', productId])
  console.log(productId)
  // EMAIL USER
  res.status(200).json({ productId })
})

router.delete('/status', async (req, res) => {
  const { productId } = req.body
  await SQLquery(`DELETE FROM products  WHERE PRODUCT_ID = ?`, [productId])

  // EMAIL USER

  res.status(200).json({ productId })
})

router.get("/view", async (req, res) => {
  const products = await SQLquery("SELECT * FROM products WHERE NOT PRODUCT_USER  = ? ORDER BY RAND() ", ['USR_7079118447'])

  res.render("admin/product-view", { products });
});

// POST ROUTES

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/PRODUCT_IMAGES/");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname;
    const ext = path.extname(fileName);
    const imageName = `PIMG_${randThisNum(10000000, 99999999)}${ext}`;
    cb(null, imageName);
  },
});

const upload = multer({ storage: storage });

router.post("/new", upload.single("image"), async (req, res) => {
  const { USER_ID } = req.session.user;
  const { filename } = req.file;
  const imagePath = `/ PRODUCT_IMAGES / ${filename}`;
  const sql =
    "INSERT INTO `images`( `IMAGE_LINK`, `IMAGE_NAME`,`PRODUCT_ID`, `USER_ID`) VALUES (?,?,?,?)";
  const response = await mysqlPool.query(sql, [
    imagePath.trim(),
    filename,
    prd,
    USER_ID,
  ]);
  res.status(200).json({ imagePath });
});

const storeVideo = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/VIDEO/");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname;
    const ext = path.extname(fileName);
    const imageName = `PVID_${randThisNum(10000000, 99999999)}${ext}`;
    cb(null, imageName);
  },
});

const up = multer({ storage: storeVideo });

// Upload a video.
router.post("/upload-video", up.single("video"), async (req, res) => {
  const { USER_ID } = req.session.user;
  const { filename } = req.file;
  const videoPath = `/ VIDEO / ${filename}`;
  const sql =
    "INSERT INTO `videos`( `VIDEO_LINK`, `VIDEO_NAME`,`PRODUCT_ID`, `USER_ID`) VALUES (?,?,?,?)";
  const response = mysqlPool.query(sql, [videoPath, filename, prd, USER_ID]);
  res.status(200).json({ videoPath });
});

router.post("/add", async (req, res) => {
  const { product_details, htmlDescription } = req.body;
  let { USER_ID } = req.session.user;
  try {
    let sql =
      "INSERT INTO `products`( `PRODUCT_ID`,`SLUG_ID`, `PRODUCT_NAME`, `PRODUCT_DESCRIPTION`, `PRODUCT_CATEGORY`, `PRODUCT_PRICE`,`PRODUCT_SIZE`, `PRODUCT_CURRENCY`, `PRODUCT_COLOR`, `PRODUCT_QUANTITY`, `MAIN_IMAGE`, `IMAGE_1`, `IMAGE_2`, `IMAGE_3`, `PRODUCT_VIDEO`, `PRODUCT_USER`, `USER_STATUS`, `ADMIN_STATUS, ADMIN_SEEN`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

    const color = JSON.stringify(
      [
        product_details.color_variants1,
        product_details.color_variants2,
        product_details.color_variants3,
        product_details.color_variants4,
        product_details.color_variants5,
        product_details.color_variants6,
      ].filter((color) => color !== null)
    );

    const size = [product_details.productSize]
    const slug = createSlug(product_details.productName)

    const userStatus = ROLE == 'admin' ? 'ENABLED' : 'DISABLED'
    const adminStatus = ROLE == 'admin' ? 'ENABLED' : 'DISABLED'

    let data = [
      prd,
      `${randThisNum(100, 999)} - ` + slug,
      product_details.productName,
      escapeHtml(htmlDescription),
      product_details.productCategory,
      product_details.productPrice,
      size,
      product_details.productCurrency && prod,
      color,
      product_details.productQuantity,
      product_details.image1,
      product_details.image2,
      product_details.image3,
      product_details.image4,
      product_details.video, //VIdeo link here
      USER_ID,
      userStatus,
      adminStatus,
      'TRUE'
    ];

    await mysqlPool.query(sql, data, (err, rows) => {
      if (err) throw err;
    });

    res.json({ message: "Successful" });
  } catch (err) {
    console.error(err);
    res.json({ message: "Sorry cant add product now" });
  }
});

router.post("/update/:id", async (req, res) => {
  const { product_details, htmlDescription } = req.body;
  let { USER_ID, ROLE } = req.session.user;
  const { id } = req.params
  const [formerData] = await SQLquery(`SELECT * FROM products WHERE PRODUCT_ID =? AND PRODUCT_USER = ?`, [id, USER_ID])

  try {

    let sql =
      `UPDATE products SET PRODUCT_ID = ?
        , SLUG_ID = ?
        , PRODUCT_NAME = ?
        , PRODUCT_DESCRIPTION = ?
        , PRODUCT_CATEGORY = ?
        , PRODUCT_PRICE = ?
        , PRODUCT_SIZE = ?
        , PRODUCT_CURRENCY = ?
        , PRODUCT_COLOR = ?
        , PRODUCT_QUANTITY = ?
        , MAIN_IMAGE = ?
        , IMAGE_1 = ?
        , IMAGE_2 = ?
        , IMAGE_3 = ?
        , PRODUCT_VIDEO = ?
        , PRODUCT_USER = ?
        , USER_STATUS = ?
        , ADMIN_STATUS = ?,ADMIN_SEEN = ? WHERE PRODUCT_ID = ?`;

    const color = JSON.stringify(
      [
        product_details.color_variants1,
        product_details.color_variants2,
        product_details.color_variants3,
        product_details.color_variants4,
        product_details.color_variants5,
        product_details.color_variants6,
      ]
    );

    const size = [product_details.productSize]
    const slug = `${randThisNum(100, 999)}-` + createSlug(product_details.productName)

    const userStatus = ROLE == 'admin' ? 'ENABLED' : 'DISABLED'
    const adminStatus = ROLE == 'admin' ? 'ENABLED' : 'DISABLED'

    let data = [
      id,
      slug && slug.length > 0 ? slug : formerData.SLUG_ID,

      product_details.productName?.length > 0 ? product_details.productName : formerData.PRODUCT_NAME,

      htmlDescription?.length > 0 ? htmlDescription : formerData.PRODUCT_DESCRIPTION,

      product_details.productCategory?.length > 0 ? product_details.productCategory : formerData.PRODUCT_CATEGORY,

      product_details.productPrice?.length > 0 ? product_details.productPrice : formerData.PRODUCT_PRICE,

      size?.length > 0 ? size : formerData.PRODUCT_SIZE,

      product_details.productCurrency?.length > 0 ? product_details.productCurrency : formerData.PRODUCT_CURRENCY,

      color?.length > 0 ? color : formerData.PRODUCT_COLOR,

      product_details.productQuantity?.length > 0 ? product_details.productQuantity : formerData.PRODUCT_QUANTITY,

      product_details.image1?.length > 0 ? product_details.image1 : formerData.MAIN_IMAGE,

      product_details.image2?.length > 0 ? product_details.image2 : formerData.IMAGE_1,

      product_details.image3?.length > 0 ? product_details.image3 : formerData.IMAGE_2,

      product_details.image4?.length > 0 ? product_details.image4 : formerData.IMAGE_3,

      product_details.video?.length > 0 ? product_details.video : formerData.PRODUCT_VIDEO,

      USER_ID,

      userStatus,

      adminStatus,

      'TRUE',

      id,
    ];

    await mysqlPool.query(sql, data, (err, rows) => {
      if (err) throw err;
    });

    res.json({ message: "Successful" });
  } catch (err) {
    console.error(err);
    res.json({ message: "Sorry cant add product now" });
  }
});

// Generate a random category image.
const categoryStore = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/CATEGORY_IMAGES/");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname;
    const ext = path.extname(fileName);
    const imageName = `CIMG_${randThisNum(10000000, 99999999)}${ext}`;
    cb(null, imageName);
  },
});

const categoryImage = multer({ storage: categoryStore });

router.post(
  "/category/add",
  categoryImage.single("image"),
  async (req, res) => {
    const { filename } = req.file;
    const { USER_ID, ROLE } = req.session.user;
    const { category_name, category_desc } = req.body;
    const imageLink = `/ CATEGORY_IMAGES / ${filename}`;
    const CAT_ID = `CAT_${randThisNum(100000, 999999)}`;

    const sql =
      "INSERT INTO `category`( `CATEGORY_NAME`, `CATEGORY_DESC`, `CATEGORY_IMAGE`, `CATEGORY_ID`, `USER_ID`) VALUES (?,?,?,?,?)";

    await mysqlPool.query(sql, [
      category_name,
      category_desc,
      imageLink,
      CAT_ID,
      USER_ID,
    ]);

    res.redirect(`/ ${ROLE} / product / category`);
  }
);


router.delete('/category', async (req, res, next) => {
  const { id } = req.body
  const { USER_ID } = req.session.user

  sql = "DELETE FROM `category` WHERE CATEGORY_ID = ? AND USER_ID = ?"
  var sql;

  if (mysqlPool.query(sql, [id, USER_ID])) {
    res.json({ message: "Category has been deleted successfully" })
  }
})

router.post("/audit", async (req, res) => {
  try {

    const { action, id, textareaValue } = req.body;
    const status = action === 'inactive' ? 'inactive' : 'active'
    const message = action === 'inactive' ? 'Post has been rejected' : 'Post has been approved'

    await SQLquery(
      `UPDATE products SET BLOG_ADMIN_STATUS = ?, SEEN = ? WHERE BLOG_ID = ? `,
      [status, "true", id]
    )

    // EMAIL OR NOTIFY BLOG USER WITH THE TEXTAREA

    res.json({
      message
    })

  } catch (err) {
    console.log(err)
    res.status(500)
  }
});

router.delete("/audit", async (req, res) => {
  try {

    const { id } = req.body;

    await SQLquery(
      `DELETE FROM products WHERE PRODUCT_ID = ? `,
      [id]
    )
    // EMAIL OR NOTIFY BLOG USER WITH THE TEXTAREA

    res.json({
      message: 'Product Deleted Successfully'
    })

  } catch (err) {
    console.log(err)
    res.status(500)
  }
});



module.exports = router;
