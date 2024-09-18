const path = require("path");
const express = require("express");
// const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const connectDB = require("./config/db");
var cors = require("cors");
// Load config
dotenv.config({ path: "./config/config.env" });

connectDB();

const app = express();

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// Method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// // Handlebars Helpers
// const {
//   formatDate,
//   stripTags,
//   truncate,
//   editIcon,
//   select,
// } = require("./helpers/hbs");

// // Handlebars
// app.engine(
//   ".hbs",
//   exphbs({
//     helpers: {
//       formatDate,
//       stripTags,
//       truncate,
//       editIcon,
//       select,
//     },
//     defaultLayout: "main",
//     extname: ".hbs",
//   })
// );
// app.set("view engine", ".hbs");

// Sessions
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

// // Passport middleware
// app.use(passport.initialize());
// app.use(passport.session());

// Set global var
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

app.get("/", (req, res) => {
  res.send("Your auth code:  " + req.query.code);
});

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Routes
// app.use("/", require("./routes/index"));
// app.use("/auth", require("./routes/auth"));
app.use("/api/meeting", require("./routes/api/meeting"));
app.use("/api/meetingAttendance", require("./routes/api/meetingAttendance"));
app.use("/auth", require("./routes/auth"));
app.use("/api/qr", require("./routes/api/qr"));
const PORT = process.env.PORT || 3000;

module.exports = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
