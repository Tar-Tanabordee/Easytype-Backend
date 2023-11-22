const prisma = require("../models/prisma");
const createError = require("../utils/create-error");
const { addressValidateSchema } = require("../validators/address-validator");
const validator = require("../validators/validate-shcema");

exports.createAddress = async (req, res, next) => {
  try {
    const foundUser = await prisma.address.findFirst({
      where: { userId: req.user.id },
    });
    const value = validator(addressValidateSchema, req.body, 400);
    if (!foundUser) {
      value.userId = req.user.id;
      const address = await prisma.address.create({ data: value });
      res.status(201).json({ message: "Create address SUCCESS", address });
    } else {
      const updateAddress = await prisma.address.update({
        where: { id: foundUser.id },
      });
      res.status(201).json({ message: "Update Address", updateAddress });
    }
  } catch (err) {
    next(err);
  }
};

exports.getAddress = async (req, res, next) => {
  try {
    if (req.user.role == "user") {
      const address = await prisma.address.findFirst({
        where: { userId: req.user.id },
      });
      return res
        .status(200)
        .json({ message: "Get address", address, userId: req.user.id });
    } else if (req.user.role == "admin") {
      return res
        .status(200)
        .json({ message: "hello admin", userId: req.user.id });
    } else {
      return res
        .status(200)
        .json({ message: "hello admin", address: {}, userId: req.user.id });
    }
    // if (!req.user) {
    //   return createError("user not found", 400);
    // }
  } catch (err) {
    next(err);
  }
};
