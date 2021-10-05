const createError = require('http-errors');

exports.roleHelper = (...roles) => {
  return async (req, res, next) => {
    try {
      const checkRole = await roles.includes(req.user.role);
      if (!checkRole)
        throw createError.Forbidden(
          'You do not have permission to perform this action'
        );
      next();
    } catch (error) {
      next(error);
    }
  };
};
