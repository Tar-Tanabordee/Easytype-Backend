const prisma = require("../models/prisma");
const createError = require("../utils/create-error");

exports.confirmOrder = async (req, res, next) => {
  try {
    const foundUser = await prisma.order.findMany({
      where: { userId: +req.user.id },
    });
    const foundOrder = foundUser.find((order) => order.id === +req.body.id);
    if (foundOrder) {
      await prisma.order.update({
        where: { id: foundOrder.id },
        data: { status: "completed" },
      });
    }
    res.status(201).json({ message: "paid" });
  } catch (err) {
    next(err);
  }
};

exports.adminConfirm = async (req, res, next) => {
  try {
    const foundOrder = prisma.order.findFirst({
      where: { id: +req.body.id },
    });
    if (!foundOrder) {
      return createError("Order not found", 400);
    }

    if (req.body.confirm === "approve") {
      await prisma.order.update({
        where: { id: +req.body.id },
        data: {
          status: "shipping",
        },
      });
      return res.status(201).json({ message: "APPROVE" });
    }
    if (req.body.confirm === "reject") {
      await prisma.order.update({
        where: { id: +req.body.id },
        data: {
          status: "cancel",
        },
      });
      return res.status(201).json({ message: "CANCEL" });
    }
  } catch (err) {
    next(err);
  }
};
