const ApiError = require('../utils/ApiError');

/**
 * Allow only the listed roles. Must run after `authenticate`.
 */
const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(401, 'Authentication required'));
  }
  if (!roles.includes(req.user.role)) {
    return next(new ApiError(403, 'Forbidden: insufficient role'));
  }
  next();
};

module.exports = { authorize };
