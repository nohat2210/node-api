const router = require('express-promise-router')();
const CategoryController = require('../controllers/category');
const Category = require('../models/Category');

const { paginatedResults } = require('../helpers/paginationHelper');
const {
  validateBody,
  validateParams,
  schemas,
} = require('../helpers/routerHelper');

router
  .route('/')
  .get(paginatedResults(Category), CategoryController.index)
  .post(validateBody(schemas.categorySchema), CategoryController.newCategory);

router
  .route('/:categoryID')
  .get(
    validateParams(schemas.idSchema, 'categoryID'),
    CategoryController.getCategory
  )
  .patch(
    validateParams(schemas.idSchema, 'categoryID'),
    validateBody(schemas.categoryOptionalSchema),
    CategoryController.updateCategory
  )
  .put(
    validateParams(schemas.idSchema, 'categoryID'),
    validateBody(schemas.categorySchema),
    CategoryController.replaceCategory
  )
  .delete(
    validateParams(schemas.idSchema, 'categoryID'),
    CategoryController.deleteCategory
  );

router
  .route('/:categoryID/products')
  .get(validateParams(schemas.idSchema.keys, 'categoryID'));

module.exports = router;
