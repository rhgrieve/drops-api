var { Drop, DropList, DropNote } = require("../models/drop");

exports.index = (req, res) => {
  return "TODO: root path";
};

/* test the REST API */

exports.test = (req, h) => {
  return "success";
};

/* get all drops */

exports.drop_list = async (req, h) => {
  const drops = Drop.find();
  return drops;
};

/* get drop by ID */

exports.drop_detail = async (req, h) => {
  const drop = await Drop.findById(req.params.id);
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
      listItems: []
    });
  } else {
    drop = new DropNote({
      createdAt: Date.now(),
      updatedAt: Date.now(),
      message: req.payload && req.payload.message ? req.payload.message : ""
    });
  }
  await drop.save();
  return drop;
};

/* delete drop by ID */

exports.drop_delete_post = (req, h) => {
  const drop = Drop.findOneAndRemove(req.params.id, {
    useFindAndModify: false
  });
  return drop;
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

    if (drop.__t == "DropList") {
      buffer = drop.listItems;
      buffer.push({
        completed: false,
        text: req.payload.text
      });
      drop.listItems = buffer;
    } else if (drop.__t == "DropNote") {
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
