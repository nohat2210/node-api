const router = require('express-promise-router')();
const ProductController = require('../controllers/product');
const paginatedResults = require('../helpers/paginationHelper');

const {
  validateBody,
  validateParams,
  schemas,
} = require('../helpers/routerHelper');

const Product = require('../models/Product');

router
  .route('/')
  .get(
    paginatedResults(Product, { path: 'category', select: 'name' }),
    ProductController.index
  )
  .post(validateBody(schemas.newProductSchema), ProductController.newProduct);

router
  .route('/:productID')
  .get(
    validateParams(schemas.idSchema, 'productID'),
    ProductController.getProduct
  )
  .put(
    validateParams(schemas.idSchema, 'productID'),
    validateBody(schemas.newProductSchema),
    ProductController.replaceProduct
  )
  .patch(
    validateParams(schemas.idSchema, 'productID'),
    validateBody(schemas.productOptionalSchema),
    ProductController.updateProduct
  )
  .delete(
    validateParams(schemas.idSchema, 'productID'),
    ProductController.deleteProduct
  );

module.exports = router;
