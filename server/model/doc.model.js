const { Schema, model } = require("mongoose");
const docSchema = new Schema(
  {
    _id: String,
    data: Object,
  },
  {
    timestamps: true,
  }
);
Doc = model("Doc", docSchema);
module.exports = Doc;
