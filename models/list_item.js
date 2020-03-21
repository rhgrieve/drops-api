const mongoose = require("mongoose");

var Drop = require("./drop");

var ListItemSchema = mongoose.Schema({
  belongs_to: Drop,
  done: Boolean
});

module.exports = mongoose.model("ListItem", ListItemSchema);
