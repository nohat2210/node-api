const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

ProductSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

ProductSchema.set('toJSON', {
  virtuals: true,
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
