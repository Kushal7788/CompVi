const express = require("express");
const cors = require("cors");
require('dotenv').config();
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var indexRouter = require("./routes/index");

const app = express();
app.use(cors());
app.use(logger("short"));
app.set("trust proxy", true);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

var mongoDB = process.env.MONGO_URL;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

app.use("/", indexRouter);

app.use("*", function (req, res, next) {
  res.status(405).json({
    success: false,
    message: "Method Not Allowed!",
  });
});

app.listen(process.env.PORT, () => {
  console.log(
    `Server running on Port: ${process.env.PORT}.`
  );
});

module.exports = app;
