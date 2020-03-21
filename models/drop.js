const mongoose = require("mongoose");

var options = { descriminatorKey: "kind" };

var DropSchema = new mongoose.Schema(
  {
    createdAt: Date,
    updatedAt: Date
  },
  options
);
var Drop = mongoose.model("Drop", DropSchema);

var DropNoteSchema = new mongoose.Schema(
  {
    message: String
  },
  options
);
var DropNote = Drop.discriminator("DropNote", DropNoteSchema);

var DropListSchema = new mongoose.Schema(
  {
    listItems: [{ completed: Boolean, text: String }]
  },
  options
);
var DropList = Drop.discriminator("DropList", DropListSchema);

module.exports = {
  Drop: Drop,
  DropNote: DropNote,
  DropList: DropList
};
