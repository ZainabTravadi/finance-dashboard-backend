// @desc    Authorize based on user role
// @param   {Array} allowedRoles - Array of roles allowed to access the route
export const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      const authError = new Error('Authentication required');
      authError.statusCode = 401;
      return next(authError);
    }

    if (!allowedRoles.includes(req.user.role)) {
      const roleError = new Error(
        `Access denied. Required roles: ${allowedRoles.join(', ')}`
      );
      roleError.statusCode = 403;
      return next(roleError);
    }

    next();
  };
};
