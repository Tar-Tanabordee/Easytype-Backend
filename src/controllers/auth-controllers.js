const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../models/prisma");
const {
  registerSchema,
  loginSchema,
  adminLoginSchema,
  adminRegisterSchema,
  updateProfileSchema,
} = require("../validators/auth-validator");

const validator = require("../validators/validate-shcema");
const createError = require("../utils/create-error");

exports.register = async (req, res, next) => {
  try {
    const { value, error } = registerSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    value.password = await bcrypt.hash(value.password, 12);
    console.log("value", value);
    const user = await prisma.user.create({
      data: value,
    });
    console.log("user", user);
    const payload = { userId: user.id };
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || "asdfghjkl",
      {
        expiresIn: process.env.JWT_EXPIRE,
      }
    );
    delete user.password;
    res
      .status(201)
      .json({ accessToken, user, message: "User Register Success" });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const value = validator(loginSchema, req.body, 400);
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: value.email }, { username: value.username }],
      },
    });
    if (!user) {
      return next(createError("user not found", 400));
    }
    const isPassword = bcrypt.compare(value.password, user.password);
    if (!isPassword) {
      return next(createError("user not found", 400));
    }

    const payload = { userId: user.id, role: user.role };
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || "1q2w3e4r5t6y7u8i9o0p",
      {
        expiresIn: process.env.JWT_EXPIRE,
      }
    );
    delete user.password;

    res.json({ message: "User login success", user, accessToken });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const value = validator(updateProfileSchema, req.body, 400);
    const updateProfile = await prisma.user.update({
      where: { id: +req.user.id },
      data: value,
    });
    res.status(201).json({ message: "Update profile Success", updateProfile });
  } catch (err) {
    next(err);
  }
};

exports.adminRegister = async (req, res, next) => {
  try {
    const value = validator(adminRegisterSchema, req.body, 400);
    value.role = "admin";
    value.password = await bcrypt.hash(value.password, 12);
    const registerAdmin = await prisma.user.create({ data: value });
    res.json({ message: "Admin register SUCCESS", registerAdmin });
  } catch (err) {
    next(err);
  }
};

exports.adminLogin = async (req, res, next) => {
  try {
    const value = validator(adminLoginSchema, req.body, 400);
    const admin = await prisma.user.findFirst({
      where: {
        AND: [
          { OR: [{ email: value.email }, { username: value.username }] },
          { role: "admin" },
        ],
      },
    });
    if (!admin) {
      return next(createError("Admin not found", 400));
    }
    const isPassword = bcrypt.compare(value.password, admin.password);
    if (!isPassword) {
      return next(createError("Invalid", 400));
    }

    const payload = { userId: admin.id, role: admin.role };
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY || "1q2w3e4r5t6y7u8i9o0p",
      {
        expiresIn: process.env.JWT_EXPIRE,
      }
    );
    delete admin.password;

    res.json({ message: "login SUCCESS", admin, payload, accessToken });
  } catch (err) {
    next(err);
  }
};

exports.getUser = async (req, res, next) => {
  try {
    if (req.user.role == "user") {
      return res.status(200).json({ message: "Access allow", user: req.user });
    }
    if (req.user.role == "admin") {
      return res.status(200).json({ message: "Access allow", admin: req.user });
    }
  } catch (err) {
    next(err);
  }
};
