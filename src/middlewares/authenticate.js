const prisma = require("../models/prisma");
const createError = require("../utils/create-error");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return next(createError("Access denined", 401));
    }

    const token = authorization.split(" ")[1];

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY || "1q2w3e4r5t6y7u8i9o0p"
    );

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });
    if (!user) {
      return next(createError("Access denined", 401));
    }
    delete user.password;
    req.user = user;
    next();
  } catch (err) {
    if (err.name === "tokenExpiredError" || "JsonWebTokenError") {
      err.statusCode = 401;
    }
    next(err);
  }
};
