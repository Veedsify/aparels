var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require("express-session");
var indexRouter = require("./routes/home_routes/home");
var userRouter = require("./routes/user_routes/user");
var adminRouter = require("./routes/admin_routes/admin");
var vendorRouter = require("./routes/vendor_routes/vendor");
const mysqlPool = require("./database/mysql");
const MySQLStore = require("express-mysql-session")(session);
require("dotenv").config()
const util = require('util');
const SQLquery = util.promisify(mysqlPool.query).bind(mysqlPool);
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set('view options', { cache: false });

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const sessionStore = new MySQLStore({
  expiration: 86400000,
  endConnectionOnClose: true,
  checkExpirationInterval: 900000,
  clearExpired: true,
  schema: {
    tableName: "session",
    columnNames: {
      session_id: "session_id",
      expires: "expires_at",
      data: "data",
    }
  },
}, mysqlPool);

const sessionConfig = {
  secret: "mysd34c23re232t",
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: { maxAge: 86400000 },
};

app.use(session(sessionConfig));
app.use(userLocals);
app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/vendor", vendorRouter);

async function userLocals(req, res, next) {
  const [siteData] = await SQLquery(`SELECT * FROM settings WHERE ID = ?`, [1])
  if (req.session.user) {
    res.locals.user = req.session.user;
    res.locals.siteData = siteData;
    res.locals.siteLink = process.env.SITE_LINK

    next()
  } else {
    res.locals.user = null;
    res.locals.siteData = siteData;
    res.locals.siteLink = process.env.SITE_LINK
     
    next()
  }
}

app.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.redirect('/login');
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('home/404');
});


//Export app

module.exports = app;
