const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BrandSchema = new Schema({
  name: { type: String, required: true, maxLength: 40 },
  photo: { type: String, required: false },

});


BrandSchema.virtual("url").get(function () {
  return `/catalog/brand/${this._id}`;
});

module.exports = mongoose.model("Brand", BrandSchema);
