/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const env = require("dotenv").config()
const path = require("path")
const app = express()
const static = require("./routes/static")
const inventoryRoutes = require('./routes/inventoryRoutes');
const accountRoutes = require('./routes/accountRoutes');
const errorHandler = require('./middleware/errorHandler');
const errorRoutes = require('./routes/errorTest');
const flash = require('express-flash');
const session = require('express-session');
const cookieParser = require("cookie-parser")

/* ***********************
 * Middleware
 ************************/
app.use(session({
  secret: 'your1234',
  resave: false,
  saveUninitialized: false
}));

app.use(flash());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser())

// Make flash messages available to all views
app.use(function(req, res, next){
  res.locals.messages = req.flash()
  next()
})

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* ***********************
 * Routes
 *************************/
app.use(static)
app.use('/inventory', inventoryRoutes);
app.use('/account', accountRoutes);
app.use('/error', errorRoutes);

// File Not Found Route - must be last route in list
app.use((req, res, next) => {
  const err = new Error('Page Not Found');
  err.status = 404;
  next(err);
});

app.use(errorHandler)

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
