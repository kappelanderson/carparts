const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const FitSchema = new Schema({
  name: { type: String, required: true, maxLength: 40 },
  photo: { type: String, required: false },

});


FitSchema.virtual("url").get(function () {
  return `/catalog/fit/${this._id}`;
});

module.exports = mongoose.model("Fit", FitSchema);
