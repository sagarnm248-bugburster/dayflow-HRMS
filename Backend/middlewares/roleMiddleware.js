const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const userRole = (req.user.role || "").toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase());

    if (!normalizedAllowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        success: false, 
        message: `Access denied. Requires one of the following roles: [${allowedRoles.join(', ')}]` 
      });
    }

    next();
  };
};

module.exports = requireRole;
