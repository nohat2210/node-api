const router = require('express-promise-router')();
const Order = require('../models/Order');
const OrderController = require('../controllers/order');

const paginatedResults = require('../helpers/paginationHelper');
const {
  validateBody,
  validateParams,
  schemas,
} = require('../helpers/routerHelper');

router
  .route('/')
  .get(paginatedResults(Order), OrderController.index)
  .post(validateBody(schemas.orderSchema), OrderController.newOrder);

router
  .route('/:orderID')
  .get(validateParams(schemas.idSchema, 'orderID'), OrderController.getOrder)
  .put(
    validateParams(schemas.idSchema, 'orderID'),
    validateBody(schemas.orderSchema),
    OrderController.replaceOrder
  )
  .patch(
    validateParams(schemas.idSchema, 'orderID'),
    validateBody(schemas.orderOptionalSchema),
    OrderController.updateOrder
  )
  .delete(
    validateParams(schemas.idSchema, 'orderID'),
    OrderController.deleteOrder
  );

module.exports = router;
