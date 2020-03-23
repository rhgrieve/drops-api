var { Drop, DropList, DropNote } = require("../models/drop");

exports.index = (req, res) => {
  return "TODO: root path";
};

/* test the REST API */

exports.test = (req, h) => {
  return "success";
};

/* get all drops */

exports.drop_list = (req, h) => {
  const drops = Drop.find();
  return drops; // .sort({ createdAt: "desc" });
};

/* get drop by ID */

exports.drop_detail = (req, h) => {
  const drop = Drop.findById(req.params.id);
  return drop;
};

/* 
create drop 
request body { type: String }

creates a DropList or DropNote dependong on `type`

type: 'list' | 'note'
*/

exports.drop_create_post = async (req, h) => {
  let drop;
  if (req.payload && req.payload.type && req.payload.type === "list") {
    drop = new DropList({
      createdAt: Date.now(),
      updatedAt: Date.now(),
      title: req.payload && req.payload.title ? req.payload.title : "",
      listItems: []
    });
  } else {
    drop = new DropNote({
      createdAt: Date.now(),
      updatedAt: Date.now(),
      title: req.payload && req.payload.title ? req.payload.title : "",
      message: req.payload && req.payload.message ? req.payload.message : ""
    });
  }
  console.log(`saved: ${drop._id}`);
  drop.save();
  return drop;
};

/* delete drop by ID */

exports.drop_delete_post = async (req, h) => {
  console.log(`deleting: ${req.params.id}`);
  return Drop.deleteOne({ _id: req.params.id }, err => {
    return err;
  });
};

/* 
DANGEROUS: delete all drops
request body { really: Boolean }

requires { really: true } to delete all
*/

exports.drop_delete_all = async (req, h) => {
  const result = await Drop.deleteMany({}, err => {
    return err;
  });

  return result;
};

/* 
create drop 
request body { text: String } | { message: String }

updates the body of a note OR adds a list item depending on 
Drop.__t ("DropList" | "DropNote")

list items default to { completed: false }
*/

exports.drop_update_post = async (req, h) => {
  try {
    const drop = await Drop.findById(req.params.id);

    console.log(req.payload.title);
    console.log(req.payload.message);

    if (drop.__t == "DropList") {
      buffer = drop.listItems;
      buffer.push({
        completed: false,
        text: req.payload.text
      });
      drop.listItems = buffer;
    } else if (drop.__t == "DropNote") {
      drop.title = req.payload.title ? req.payload.title : drop.title;
      drop.message = req.payload.message;
    }
    drop.updatedAt = Date.now();
    await drop.save().then(console.info(`drop saved: ${drop._id}`));

    return drop;
  } catch (e) {
    console.error(`error updating drop: ${e}`);
    return e;
  }
};
