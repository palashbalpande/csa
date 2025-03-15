const jwt = require("jsonwebtoken");

function userMiddleware(req, res, next) {
  const token = req.headers.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_USER_CODE);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = {
  userMiddleware,
};
