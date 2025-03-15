const jwt = require("jsonwebtoken");

function adminMiddleware(req, res, next) {
  const token = req.headers.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ADMIN_CODE);
    req.adminId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = {
  adminMiddleware,
};
