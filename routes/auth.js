const router = require('express-promise-router')();
const AuthController = require('../controllers/auth');
const {
  validateBody,
  validateParams,
  schemas,
} = require('../helpers/routerHelper');

const passport = require('passport');
require('../middlewares/passport');

router
  .route('/google')
  .post(
    passport.authenticate('google-plus-token', { session: false }),
    AuthController.authGoolge
  );

router
  .route('/facebook')
  .post(
    passport.authenticate('facebook-token', { session: false }),
    AuthController.authFacebook
  );

router
  .route('/login')
  .post(
    validateBody(schemas.authLoginSchema),
    passport.authenticate('local', { session: false }),
    AuthController.login
  );

router.route('/logout').post(AuthController.logout);

router.route('/refresh-token').post(AuthController.refreshToken);

router
  .route('/register')
  .post(validateBody(schemas.authRegisterSchema), AuthController.register);

router
  .route('/secret')
  .get(passport.authenticate('jwt', { session: false }), AuthController.secret);

module.exports = router;
