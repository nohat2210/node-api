const router = require('express-promise-router')();
const CategoryController = require('../controllers/category');
const Category = require('../models/Category');

const { paginatedResults } = require('../helpers/paginationHelper');
const roleHelper = require('../helpers/roleHelper');
const {
  validateBody,
  validateParams,
  schemas,
} = require('../helpers/routerHelper');

router
  .route('/')
  .get(paginatedResults(Category), CategoryController.index)
  .post(
    validateBody(schemas.categorySchema),
    roleHelper('admin'),
    CategoryController.newCategory
  );

router
  .route('/:categoryID')
  .get(
    validateParams(schemas.idSchema, 'categoryID'),
    CategoryController.getCategory
  )
  .patch(
    validateParams(schemas.idSchema, 'categoryID'),
    validateBody(schemas.categoryOptionalSchema),
    roleHelper('admin'),
    CategoryController.updateCategory
  )
  .put(
    validateParams(schemas.idSchema, 'categoryID'),
    validateBody(schemas.categorySchema),
    roleHelper('admin'),
    CategoryController.replaceCategory
  )
  .delete(
    validateParams(schemas.idSchema, 'categoryID'),
    roleHelper('admin'),
    CategoryController.deleteCategory
  );

router
  .route('/:categoryID/products')
  .get(validateParams(schemas.idSchema.keys, 'categoryID'));

module.exports = router;
