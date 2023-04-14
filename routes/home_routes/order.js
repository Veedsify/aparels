const express = require("express");
const mysqlPool = require("../../database/mysql");
const util = require('util');
const SQLquery = util.promisify(mysqlPool.query).bind(mysqlPool);
const router = express.Router();
const randThisNum = require("../../configs/randomNumbers");
const { v4: uuidv4 } = require("uuid");

const axios = require("axios");
const orderConfirmedEmail = require("../../mailer/orderSuccessEmail");
const orderVendorEmail = require("../../mailer/orderSuccessVendor");

router.get("/track/:order_id", (req, res) => {
  const { USER_ID } = req.session.user;
  const { order_id } = req.params;
  mysqlPool.query(
    ` SELECT * FROM \`order\` WHERE ORDER_ID = ?
    `,
    [order_id],
    (err, rows) => {
      if (err || !rows || rows.length === 0) {
        res.render("home/404");
      } else {
        res.render("home/order-tracking", { order_id, orders: rows });
      }
    }
  );
});

router.use(checkUserStatus);

router.get("/successful/:order_id", async (req, res) => {
  const { USER_ID } = req.session.user;
  const { order_id } = req.params;
  mysqlPool.query(
    `
        SELECT * FROM \`order\` WHERE TRANSACTION_REF = ? AND USER_ID = ?
    `,
    [order_id, USER_ID], async (err, rows) => {
      if (err || !rows || rows.length === 0) {
        res.render("home/404");
      } else {

        const [shipping] = await SQLquery(`SELECT SUM(SHIPPING_FEE) AS fee FROM \`order\` WHERE TRANSACTION_REF = ?`, [order_id])

        const [total] = await SQLquery(`SELECT SUM(SUBTOTAL) AS total FROM \`order\` WHERE TRANSACTION_REF = ?`, [order_id])

        // const [total] = await SQLquery(`SELECT SUM(SUBTOTAL) AS total FROM \`order\` WHERE TRANSACTION_REF = ?`,[order_id])

        res.render("home/order-success", { order_id, orders: rows, shipping, total });
      }
    }
  );
});

router.put("/create-new-order", async (req, res) => {
  const { USER_ID, EMAIL, PHONE, NAME, CARD_ID } = req.session.user;
  const {
    firstname,
    lastname,
    phone,
    email,
    country,
    address,
    city,
    state,
    postalcode,
    card,
    delivery,
  } = req.body;

  const cartItems = await new Promise((resolve, reject) => {
    const sql = `SELECT * FROM cart WHERE USER_ID = ?; SELECT SUM(total_price) AS total
                 FROM(
                   SELECT SUM(TOTAL) AS total_price
                   FROM cart
                   WHERE USER_ID = ?
                   GROUP BY PRODUCT_ID
                 ) AS subquery
               ;`;
    mysqlPool.query(sql, [USER_ID, USER_ID], (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });

  const [cartItemsData, totalsData] = cartItems;
  const { total: totalAmount } = totalsData[0];

  if (card.card) {
    let trans_ref = `TRX-${uuidv4()}`;

    try {
      const shippingFee = parseFloat(process.env.SHIPPING_FEE);

      const response = await axios.post(
        "https://api.flutterwave.com/v3/payments",
        {
          tx_ref: trans_ref,
          amount: totalAmount * (1 + shippingFee / 100),
          currency: "NGN",
          redirect_url: `${req.protocol}://${req.get(
            "host"
          )}/order/verify-order`,
          meta: {
            consumer_id: USER_ID,
            consumer_mac: CARD_ID,
          },
          customer: {
            email: email,
            phonenumber: phone,
            name: `${firstname} ${lastname}`,
          },
          customizations: {
            title: cartItemsData[0].PRODUCT_NAME,
            logo: `${req.protocol}://${req.get("host")}${cartItemsData[0].PRODUCT_IMAGE
              }`,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.FL_SECRET_KEY}`,
          },
        }
      );

      const finalAmount = totalAmount * (1 + parseFloat(shippingFee) / 100);
      const deliveryMethod = Object.keys(delivery).filter(
        (key) => delivery[key]
      );
      const paymentType = Object.keys(card).filter((key) => card[key]);
      const items = JSON.stringify(cartItemsData);

      for (const cardItem of cartItemsData) {

        const [productUser] = await SQLquery(`SELECT * FROM products WHERE PRODUCT_ID = ?`, [cardItem.PRODUCT_ID])

        const today = new Date().toISOString().slice(0, 10);

        const data = [
          `ORD_${randThisNum(100000, 999999)}`,
          USER_ID,
          productUser.PRODUCT_USER,
          cardItem.PRODUCT_ID,
          "pending",
          cardItem.PRODUCT_NAME,
          `${cardItem.QUANTITY} x ${cardItem.PRODUCT_NAME}, SIZE: ${cardItem.SIZE}, color: ${cardItem.COLOR}`,
          cardItem.PRODUCT_IMAGE,
          cardItem.PRODUCT_PRICE,
          cardItem.QUANTITY,
          cardItem.SIZE,
          `${cardItem.COLOR}`,
          firstname,
          lastname,
          phone,
          email,
          country,
          address,
          city,
          state,
          postalcode,
          items,
          cardItem.PRODUCT_PRICE * cardItem.QUANTITY,
          deliveryMethod,
          Number(cardItem.PRODUCT_PRICE * cardItem.QUANTITY) *
          (parseFloat(shippingFee) / 100),
          Number(cardItem.PRODUCT_PRICE * cardItem.QUANTITY) *
          (1 + parseFloat(shippingFee) / 100),
          finalAmount,
          paymentType,
          "FALSE",
          trans_ref,
          today
        ];

        try {
          await mysqlPool.query(
            `
                        INSERT INTO \`order\` (
                            ORDER_ID, USER_ID,PRODUCT_USER, PRODUCT_ID, ORDER_STATUS, ORDER_NAME, ORDER_DESC,
                            ORDER_IMAGE, ORDER_PRICE, ORDER_QUANTITY, PRODUCT_SIZE, PRODUCT_COLOR,
                            FIRST_NAME, LAST_NAME, PHONE, EMAIL_ADDRESS, COUNTRY, ADDRESS,
                            CITY, STATE, POSTAL_CODE, ITEMS, SUBTOTAL, SHIPPING_METHOD,
                            SHIPPING_FEE, FINAL_PRICE, GRAND_TOTAL, PAYMENT_TYPE, PAYMENT_SUCCESSFUL, TRANSACTION_REF, ORDER_DATE
                        ) VALUES (?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `,
            data,
            (err, rows) => {
              if (err) throw err;
            }
          );
        } catch (err) {
          console.error(`Error inserting order: ${err}`);
          throw err;
        }
      }

      res.json({
        url: response.data.data.link,
      });
    } catch (err) {
      console.log(err.code);
      console.log(err);
    }
  }
});



router.get("/verify-order", async (req, res) => {
  // Extract relevant data from the request object
  const { status, tx_ref } = req.query;
  const { USER_ID } = req.session.user;

  // Retrieve order details from the database using a promise-based function
  const orders = await SQLquery("SELECT * FROM `order` WHERE TRANSACTION_REF = ?", [tx_ref]);

  for (const order of orders) {
    const product = await SQLquery(
      "SELECT PRODUCT_QUANTITY FROM `products` WHERE PRODUCT_ID = ?",
      [order.PRODUCT_ID]
    );

    const orderAmount = await SQLquery(
      "SELECT SUM(ORDER_QUANTITY) AS quantity FROM `order` WHERE TRANSACTION_REF = ?",
      [tx_ref]
    );

    const removed = product[0].PRODUCT_QUANTITY - orderAmount[0].quantity;

    if (status === "successful") {
      await SQLquery(
        "UPDATE products SET PRODUCT_QUANTITY = ? WHERE PRODUCT_ID = ?",
        [removed, order.PRODUCT_ID]
      );

      const [product] = await SQLquery(
        "SELECT * FROM products WHERE PRODUCT_ID = ?",
        [order.PRODUCT_ID]
      );

      await SQLquery(
        "UPDATE `order` SET PAYMENT_SUCCESSFUL = ? WHERE TRANSACTION_REF = ?; DELETE FROM cart WHERE USER_ID = ?;",
        ["TRUE", tx_ref, USER_ID]
      );

      const method = order.SHIPPING_METHOD === 'home' ? 'Home Delivery' : 'Pickup Station';
      const estimatedDeliveryDate = new Date(order.DATE);
      estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 3);
      const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
      const localeDateString = estimatedDeliveryDate.toLocaleDateString('en-US', options);
      const [dayOfWeek, month, day, year] = localeDateString.split(' ');

      const formattedDate = `${day}-${dayOfWeek.toUpperCase()}, ${month.toUpperCase()}, ${year}`;
      // Send confirmation email for this order
      const [user] = await SQLquery(`SELECT * FROM user WHERE USER_ID = ?`, [order.PRODUCT_USER])

      await orderConfirmedEmail(
        req.session.user.NAME,
        req.session.user.PHONE,
        req.session.user.EMAIL,
        order.ORDER_ID,
        order.ORDER_NAME,
        order.ORDER_QUANTITY,
        order.ORDER_PRICE,
        order.SHIPPING_FEE,
        order.FINAL_PRICE,
        `${order.ADDRESS}, ${order.CITY}, ${order.POSTAL_CODE} ${order.STATE}, ${order.COUNTRY}`,
        method,
        `LAGOS`,
        formattedDate,
        order.ORDER_DESC,
        order
      )

      await orderVendorEmail(order, product, user)

    } else {
      await SQLquery("DELETE FROM `order` WHERE TRANSACTION_REF = ?", [tx_ref]);
    }
  }



  res.redirect(status === "successful" ? `/order/successful/${tx_ref}` : "/order/cart");
});


router.get("/cart", async (req, res) => {
  const { USER_ID } = req.session.user;
  const cartItems = await new Promise((resolve, reject) => {
    const sql = `SELECT * FROM cart WHERE USER_ID = ?; SELECT SUM(total_price) AS total
                 FROM(
                   SELECT SUM(TOTAL) AS total_price
                   FROM cart
                   WHERE USER_ID = ?
                   GROUP BY PRODUCT_ID
                 ) AS subquery
               ;`;
    mysqlPool.query(sql, [USER_ID, USER_ID], (err, rows) => {
      if (err) reject(err);
      resolve(rows);
    });
  });

  const [cartItemsData, totalsData] = cartItems;
  const { total: totalAmount } = totalsData[0];

  res.render("home/cart", {
    cartItems: cartItemsData,
    totals: totalAmount,
  });
});

router.post("/cart", async (req, res) => {
  const { USER_ID } = req.session.user;
  const cartItems = await new Promise((resolve, reject) => {
    const sql = `SELECT SUM(total_price) AS total
                 FROM(
                   SELECT SUM(TOTAL) AS total_price
                   FROM cart
                   WHERE USER_ID = ?
                   GROUP BY PRODUCT_ID
                 ) AS subquery
               ;`;
    mysqlPool.query(sql, [USER_ID], (err, rows) => {
      if (err) reject(err);
      resolve(rows[0]);
    });
  });

  const totalAmount = cartItems;

  res.json({
    totals: totalAmount.total,
  });
});

router.post("/add-to-cart", async (req, res) => {
  const { ID, size, quantity, color } = req.body;

  if (!req.session.user) {
    return res.json({
      link: '/login'
    })
  }

  const { USER_ID } = req.session.user;


  const [product] = await new Promise((resolve, reject) => {
    mysqlPool.query(
      "SELECT * FROM products WHERE PRODUCT_ID = ?",
      [ID],
      (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      }
    );
  });

  const [checkProducts] = await new Promise((resolve, reject) => {
    mysqlPool.query(
      "SELECT * FROM cart WHERE PRODUCT_ID = ? AND USER_ID = ?",
      [ID, USER_ID],
      (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      }
    );
  });

  if (checkProducts) {
    let sql =
      "UPDATE cart SET PRODUCT_NAME = ?, PRODUCT_IMAGE = ?, PRODUCT_PRICE = ?,PRODUCT_CURRENCY = ?, QUANTITY = ?, SIZE = ?, COLOR = ?, TOTAL = ? WHERE PRODUCT_ID = ? AND USER_ID = ?";

    const data = [
      product.PRODUCT_NAME,
      product.MAIN_IMAGE,
      product.PRODUCT_PRICE,
      product.PRODUCT_CURRENCY,
      quantity,
      size,
      color.replace("product-", ""),
      quantity * product.PRODUCT_PRICE,
      ID,
      USER_ID,
    ];

    await mysqlPool.query(sql, data, (err, rows) => {
      if (err) throw err;
    });

    return res.json({
      message: "successful",
    });
  }

  try {
    let sql =
      "INSERT INTO cart (CART_ID, PRODUCT_NAME, PRODUCT_IMAGE, PRODUCT_PRICE,PRODUCT_CURRENCY, USER_ID, PRODUCT_ID, QUANTITY, SIZE,COLOR, TOTAL) VALUES (?,?,?,?,?,?,?,?,?,?,?)";

    const cartid = `CRT_${randThisNum(1000000, 9999999)}`;
    const data = [
      cartid,
      product.PRODUCT_NAME,
      product.MAIN_IMAGE,
      product.PRODUCT_PRICE,
      product.PRODUCT_CURRENCY,
      USER_ID,
      ID,
      quantity,
      size,
      color.replace("product-", ""),
      quantity * product.PRODUCT_PRICE,
    ];

    await mysqlPool.query(sql, data, (err, rows) => {
      if (err) throw err;
    });

    res.json({
      message: "successful",
    });
  } catch (err) {
    console.error(err);
  }
});

router.post("/get-cart", async (req, res) => {
  if (req.session.user) {
    const { USER_ID } = req.session.user;

    const sql = `
           SELECT SUM(total_price) AS total
           FROM (
               SELECT SUM(TOTAL) AS total_price
               FROM cart
               WHERE USER_ID = ?
               GROUP BY PRODUCT_ID
           ) AS subquery 
       `;

    // const sql = `
    // SELECT SUM(total_price) AS your_price
    // FROM (
    // SELECT SUM(PRODUCT_PRICE * QUANTITY) AS total_price
    // FROM cart
    // WHERE USER_ID = ?
    // GROUP BY PRODUCT_ID) AS subquery;`;

    const getSum = await new Promise((resolve, reject) => {
      mysqlPool.query(sql, [USER_ID], (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });

    mysqlPool.query(
      "SELECT * FROM cart WHERE USER_ID = ? ORDER BY ID DESC;",
      [USER_ID],
      (err, rows) => {
        if (err) {
          console.error(err);
          return res.json({});
        }

        const items = rows.slice(0, 2);
        const totalItems = rows.length;
        const price = getSum[0]?.total;
        return res.json({ items, totals: totalItems, price });
      }
    );
  } else {
    res.status(404);
  }
});

router.delete("/remove-cart-item", (req, res) => {
  if (req.session.user) {
    const { ID } = req.body;
    mysqlPool.query(
      "DELETE FROM cart WHERE PRODUCT_ID = ?",
      [ID],
      (err, rows) => {
        if (err) {
          throw err;
        }
        res.json({ message: "removed" });
      }
    );
  } else {
    res.json({});
  }
});

function checkUserStatus(req, res, next) {
  const user = req.session.user;

  let myUrl;

  if (req.method === "GET") {
    myUrl = req.originalUrl;
  }

  if (!user) {

    req.session.destroy();
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      // This is an AJAX request
      return res.json({ link: '/login' });
    } else {
      // This is a normal request
      return res.redirect(`/login?ref=${myUrl}`);
    }

  }

  const { VERIFICATION, ROLE } = req.session.user;
  const allowedRoles = ["user", "vendor"];

  if (!allowedRoles.includes(ROLE)) {
    return res.redirect(`/${ROLE}`);
  }

  if (VERIFICATION === "false") {
    return res.redirect("/login/verification-needed");
  }

  // Call next() to continue processing the request
  next();
}
module.exports = router;
