const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const User = require('../models/User');

const index = async (req, res, next) => {
  return res.status(200).json(res.paginatedResults);
};

const newOrder = async (req, res, next) => {
  const { orderItems, status, totalPrice, owner } = req.value.body;
  const orderItemIds = Promise.all(
    orderItems.map(async orderItemId => {
      const { quantity, product } = orderItemId;
      const orderItem = new OrderItem({ quantity, product });
      await orderItem.save();
      return orderItem._id;
    })
  );
  const orderItemsIdsResolved = await orderItemIds;
  const order = new Order({
    orderItems: orderItemsIdsResolved,
    status,
    totalPrice,
    owner,
  });
  await order.save();
  return res.status(201).json({ success: true, order });
};

const getOrder = async (req, res, next) => {
  const { orderID } = req.value.params;
  const order = await Order.findById(orderID)
    .populate('owner')
    .populate({ path: 'orderItems', populate: 'product' });
  return res.status(200).json({ order });
};

const updateOrder = async (req, res, next) => {
  const { orderID } = req.value.params;
  const order = await Order.findById(orderID);
  const newOrder = req.value.body;
  const result = await Order.findByIdAndUpdate(orderID, newOrder, {
    new: true,
  });
  return res.status(200).json({ success: true });
};

const replaceOrder = async (req, res, next) => {
  const { orderID } = req.value.params;
  const order = await Order.findById(orderID);
  const newOrder = req.value.body;
  const result = await Order.findByIdAndUpdate(orderID, newOrder, {
    new: true,
  });
  return res.status(200).json({ success: true });
};

const deleteOrder = async (req, res, next) => {
  const { orderID } = req.value.params;
  const order = await Order.findById(orderID);

  order.orderItems.forEach(async orderItemID => {
    return await OrderItem.findByIdAndRemove(orderItemID);
  });
  await order.remove();

  return res.status(200).json({ success: true });
};

module.exports = {
  index,
  newOrder,
  getOrder,
  updateOrder,
  replaceOrder,
  deleteOrder,
};
