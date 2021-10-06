const router = require('express-promise-router')();

const UserController = require('../controllers/user');
const User = require('../models/User');

const {
  validateBody,
  validateParams,
  schemas,
} = require('../helpers/routerHelper');

const paginatedResults = require('../helpers/paginationHelper');

router
  .route('/')
  .get(paginatedResults(User), UserController.index)
  .post(validateBody(schemas.userSchema), UserController.newUser);

router
  .route('/:userID')
  .get(validateParams(schemas.idSchema, 'userID'), UserController.getUser)
  .put(
    validateParams(schemas.idSchema, 'userID'),
    validateBody(schemas.userSchema),
    UserController.replaceUser
  )
  .patch(
    validateParams(schemas.idSchema, 'userID'),
    validateBody(schemas.userOptionalSchema),
    UserController.updateUser
  );

router
  .route('/:userID/products')
  .get(
    validateParams(schemas.idSchema, 'userID'),
    paginatedResults(User),
    UserController.getUserProducts
  )
  .post(
    validateParams(schemas.idSchema, 'userID'),
    validateBody(schemas.productSchema),
    UserController.newUserProduct
  );

module.exports = router;
