const prisma = require("../models/prisma");
const createError = require("../utils/create-error");
const upload = require("../utils/cloudinary-service");

exports.createOrder = async (req, res, next) => {
  try {
    const getShoppingCart = await prisma.shoppingCarts.findMany({
      where: { userId: req.user.id },
      include: { product: { select: { price: true } } },
    });
    if (!getShoppingCart) {
      return createError("Not found user", 400);
    }
    const sumPrice = getShoppingCart.reduce(
      (acc, item) => (acc += item.product.price * item.amount),
      0
    );
    const orderData = { userId: req.user.id, sumPrice };
    const orderItemList = getShoppingCart.map((item) => {
      return {
        amount: item.amount,
        totalPrice: item.amount * item.product.price,
        productId: item.productId,
      };
    });
    const order = await prisma.order.create({
      data: {
        ...orderData,
        orderItem: {
          create: orderItemList,
        },
      },
      include: {
        orderItem: {
          include: {
            product: {
              select: {
                id: true,
                productName: true,
              },
            },
          },
        },
      },
    });
    await prisma.shoppingCarts.deleteMany({});
    res.json({ order });
  } catch (err) {
    next(err);
  }
};

exports.getOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const foundUserOrder = await prisma.order.findMany({
      where: { userId: req.user.id },
    });
    if (req.user.role === "user") {
      const foundOrder = foundUserOrder.find((item) => item.id == orderId);
      if (!foundOrder) {
        return createError("notfound order", 400);
      }
      const getOrder = await prisma.order.findFirst({
        where: { id: foundOrder.id },
        include: {
          orderItem: {
            include: {
              product: {
                select: {
                  id: true,
                  productName: true,
                },
              },
            },
          },
        },
      });
      return res.status(200).json({ message: "Get Order", getOrder });
    } else if (req.user.role === "admin") {
      const getOrder = await prisma.order.findFirst({
        where: { id: +orderId },
        include: {
          orderItem: {
            include: {
              product: {
                select: {
                  id: true,
                  productName: true,
                },
              },
            },
          },
        },
      });
      return res.status(200).json({ message: "Admin Get Order", getOrder });
    }
  } catch (err) {
    next(err);
  }
};

exports.getAllOrder = async (req, res, next) => {
  try {
    if (req.user.role === "user") {
      const getAllOrder = await prisma.order.findMany({
        where: { userId: +req.user.id },
      });
      return res.status(200).json({ getAllOrder });
    } else if (req.user.role === "admin") {
      const getAllOrder = await prisma.order.findMany({
        include: {
          transaction: {
            select: {
              payment: true,
            },
          },
        },
      });
      return res.status(200).json({ getAllOrder });
    } else {
      return createError("not found order", 400);
    }
  } catch (err) {
    next(err);
  }
};

exports.checkoutOrder = async (req, res, next) => {
  try {
    const foundUser = await prisma.order.findMany({
      where: { userId: req.user.id },
    });
    const foundOrder = foundUser.find((item) => item.id === +req.body.id);
    if (!foundOrder) {
      return createError("not found order", 400);
    }
    const createTransaction = await prisma.transaction.create({
      data: { orderId: foundOrder.id },
    });
    res.status(200).json({ message: "Wait for Pay", createTransaction });
  } catch (err) {
    next(err);
  }
};

exports.paidOrder = async (req, res, next) => {
  try {
    const foundOrderUser = await prisma.order.findMany({
      where: { userId: req.user.id },
    });

    const { paymentId } = req.params;
    const foundOrder = foundOrderUser.find((item) => item.id == +paymentId);

    const foundtransaction = await prisma.transaction.findFirst({
      where: { orderId: foundOrder.id },
    });

    if (foundtransaction && req.file) {
      const url = await upload(req.file.path);
      await prisma.transaction.update({
        where: { id: foundtransaction.id },
        data: {
          slip: url,
          payment: "paid",
        },
      });
      // console.log("update upload");
      // const uploadSlip = await prisma.order.update({
      //   where: { id: foundOrder.id },
      //   data: { status: "shipping" },
      // });
      return res.status(200).json({ message: "get trans" });
    }
  } catch (err) {
    next(err);
  }
};
