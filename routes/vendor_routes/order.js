const express = require("express");
const router = express.Router();
const mysqlPool = require("../../database/mysql");
const util = require("util");
const orderStatus = require("../../mailer/orderStatus");
const SQLquery = util.promisify(mysqlPool.query).bind(mysqlPool);

router.get("/", async (req, res) => {
  try {
    const response = await SQLquery(
      `SELECT * FROM \`order\` WHERE PAYMENT_SUCCESSFUL = ? AND ORDER_STATUS = ? AND PRODUCT_USER =?  ORDER BY ID DESC`,
      ["TRUE", "pending", req.session.user.USER_ID]
    );

    res.render("vendor/order", { pendingOrders: response });
  } catch (err) {
    console.error(err);
  }
});

router.get("/delivered", async (req, res) => {
  try {
    const response = await SQLquery(
      `SELECT * FROM \`order\` WHERE PAYMENT_SUCCESSFUL = ? AND ORDER_STATUS = ? AND PRODUCT_USER =? ORDER BY ID DESC`,
      ["TRUE", "delivered", req.session.user.USER_ID]
    );
    res.render("vendor/delivered-orders", { deliveredOrder: response });
  } catch (err) {
    console.error(err);
  }
});

router.get("/shipped", async (req, res) => {
  try {
    const response = await SQLquery(
      `SELECT * FROM \`order\` WHERE PAYMENT_SUCCESSFUL = ? AND ORDER_STATUS = ? AND PRODUCT_USER =? ORDER BY ID DESC`,
      ["TRUE", "shipped", req.session.user.USER_ID]
    );
    res.render("vendor/shipped-orders", { shippedOrder: response });
  } catch (err) {
    console.error(err);
  }
});

router.get("/ready", async (req, res) => {
  try {
    const response = await SQLquery(
      `SELECT * FROM \`order\` WHERE PAYMENT_SUCCESSFUL = ? AND ORDER_STATUS = ? AND PRODUCT_USER =? ORDER BY ID DESC`,
      ["TRUE", "ready", req.session.user.USER_ID]
    );
    res.render("vendor/ready-shipping", { readyOrders: response });
  } catch (err) {
    console.error(err);
  }
});

router.get("/processing", async (req, res) => {
  try {
    const response = await SQLquery(
      `SELECT * FROM \`order\` WHERE PAYMENT_SUCCESSFUL = ? AND ORDER_STATUS = ? AND PRODUCT_USER =? ORDER BY ID DESC`,
      ["TRUE", "processing", req.session.user.USER_ID]
    );
    res.render("vendor/processing-orders", { processingOrders: response });
  } catch (err) {
    console.error(err);
  }
});

router.get("/detail/:order_id", async (req, res) => {
  const { order_id } = req.params
  const data = await SQLquery(`SELECT * FROM \`order\` WHERE ORDER_ID = ? `, [order_id])
  res.render("vendor/order-details", { orderDetail: data[0] });
});


// ORDER PROGRESS

router.post("/approveOrder", async (req, res) => {
  try {
    const { orderid } = req.body;
    const updateData = await SQLquery(
      `UPDATE \`order\` SET ORDER_STATUS = ? WHERE ORDER_ID = ?`,
      ["processing", orderid]
    );

    const [orderData] = await SQLquery(
      `SELECT * FROM \`order\` WHERE ORDER_ID = ?`,
      [orderid]
    );
    const [userData] = await SQLquery(`SELECT * FROM user WHERE USER_ID = ?`, [
      orderData.USER_ID,
    ]);

    await orderStatus(
      userData.NAME,
      userData.EMAIL,
      `Your order has been received and we are currently working on shipping your order as quick as possible`,
      orderData,
      `Your order ${orderid} has been received`
    );
    res.json({});
  } catch (err) {
    console.error(err);
  }
});

router.post("/readyOrder", async (req, res) => {
  try {
    const { orderid } = req.body;
    const updateData = await SQLquery(
      `UPDATE \`order\` SET ORDER_STATUS = ? WHERE ORDER_ID = ?`,
      ["ready", orderid]
    );

    const [orderData] = await SQLquery(
      `SELECT * FROM \`order\` WHERE ORDER_ID = ?`,
      [orderid]
    );
    const [userData] = await SQLquery(`SELECT * FROM user WHERE USER_ID = ?`, [
      orderData.USER_ID,
    ]);

    await orderStatus(
      userData.NAME,
      userData.EMAIL,
      `Your order is ready to be shipped`,
      orderData,
      `Your order ${orderid} is ready to be shipped`
    );

    res.json({});
  } catch (err) {
    console.error(err);
  }
});

router.post("/shippedOrder", async (req, res) => {
  try {
    const { orderid } = req.body;
    const updateData = await SQLquery(
      `UPDATE \`order\` SET ORDER_STATUS = ? WHERE ORDER_ID = ?`,
      ["shipped", orderid]
    );

    const [orderData] = await SQLquery(
      `SELECT * FROM \`order\` WHERE ORDER_ID = ?`,
      [orderid]
    );
    const [userData] = await SQLquery(`SELECT * FROM user WHERE USER_ID = ?`, [
      orderData.USER_ID,
    ]);

    await orderStatus(
      userData.NAME,
      userData.EMAIL,
      `Your order is has been shipped`,
      orderData,
      `Your order ${orderid} has been shipped`
    );

    res.json({});
  } catch (err) {
    console.error(err);
  }
});

router.post("/deliveredOrder", async (req, res) => {
  try {
    const { orderid } = req.body;
    const updateData = await SQLquery(
      `UPDATE \`order\` SET ORDER_STATUS = ? WHERE ORDER_ID = ?`,
      ["delivered", orderid]
    );

    const [orderData] = await SQLquery(
      `SELECT * FROM \`order\` WHERE ORDER_ID = ?`,
      [orderid]
    );
    const [userData] = await SQLquery(`SELECT * FROM user WHERE USER_ID = ?`, [
      orderData.USER_ID,
    ]);

    await orderStatus(
      userData.NAME,
      userData.EMAIL,
      `Your order is has delivered successfully`,
      orderData,
      `Your order ${orderid} has been delivered`
    );

    res.json({});
  } catch (err) {
    console.error(err);
  }
});

router.post("/cancelOrder", async (req, res) => {
  try {

    const { orderid } = req.body;
    const updateData = await SQLquery(
      `UPDATE \`order\` SET ORDER_STATUS = ? WHERE ORDER_ID = ?`,
      ["cancelled", orderid]
    );

    const [orderData] = await SQLquery(
      `SELECT * FROM \`order\` WHERE ORDER_ID = ?`,
      [orderid]
    );
    const [userData] = await SQLquery(`SELECT * FROM user WHERE USER_ID = ?`, [
      orderData.USER_ID,
    ]);

    await orderStatus(
      userData.NAME,
      userData.EMAIL,
      `We are sorry but we cannot proceed with your order and it has been cancelled, our support team will contact you to process your refund`,
      orderData,
      `Your order ${orderid} was cancelled`
    );
    res.json({});
  } catch (err) {
    console.error(err);
  }
});

router.post('/hideOrder', async (req, res) => {
  const { orderid } = req.body
  const updateData = await SQLquery(
    `UPDATE \`order\` SET ORDER_STATUS = ? WHERE ORDER_ID = ?`,
    ['hidden', orderid]
  )
  if (updateData) {
    res.json({})
  }
})

module.exports = router;
