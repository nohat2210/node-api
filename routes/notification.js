const router = require('express-promise-router')();
const Notification = require('../models/Notification');
const NotificationController = require('../controllers/notification');

const { paginatedResults } = require('../helpers/paginationHelper');
const {
  validateBody,
  validateParams,
  schemas,
} = require('../helpers/routerHelper');

router
  .route('/')
  .get(paginatedResults(Notification), NotificationController.index)
  .post(
    validateBody(schemas.notificationSchema),
    NotificationController.newNotification
  );

router
  .route('/:notificationID')
  .get(validateParams(schemas.idSchema, 'notificationID'));

module.exports = router;
