const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderItemSchema = Schema({
  quantity: {
    type: Number,
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
  },
});

const OrderItem = mongoose.model('OrderItem', OrderItemSchema);

module.exports = OrderItem;
