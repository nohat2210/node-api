const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = Schema({
  orderItems: [
    {
      type: Schema.Types.ObjectId,
      ref: 'OrderItem',
      required: true,
    },
  ],
  status: {
    type: String,
    default: 'pending',
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

OrderSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

OrderSchema.set('toJSON', {
  virtuals: true,
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
