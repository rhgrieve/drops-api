require("dotenv").config();
const mongoose = require("mongoose");

start = () => {};

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  console.log("connected to mongodb");
});

exports.start = start();
