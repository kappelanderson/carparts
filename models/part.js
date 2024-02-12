const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PartSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  photo: { type: String, required: false },
  price: { type: Number, required: true },
  number_in_stock: { type: Number, required: true },
  fit: [{ type: Schema.Types.ObjectId, ref: "Fit", required: true }],
  category: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  brand: [{ type: Schema.Types.ObjectId, ref: "Brand", required: true }],
});

// Virtual for book's URL
PartSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/part/${this._id}`;
});

// Export model
module.exports = mongoose.model("Part", PartSchema);
