const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: {
    type: String,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
});

CategorySchema.virtual('id').get(function () {
  return this._id.toHexString();
});

CategorySchema.set('toJSON', {
  virtuals: true,
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
