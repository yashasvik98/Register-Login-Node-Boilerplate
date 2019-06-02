const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const favicon = require("serve-favicon");
const path = require("path");

const app = express();

// Passport Configuration
require("./config/passport")(passport);

//DB Configuration
const db = require("./config/keys").MongoURI;
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => console.log(err));

//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Express Session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

app.use(favicon("favicon.ico"));
// Routes
app.use("/", require("./routes/index"));

app.get("/favicon.ico", (req, res) => res.status(204));
app.use("/users", require("./routes/users"));

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log("App is running on port " + port);
});
