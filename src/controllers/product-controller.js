const prisma = require("../models/prisma");
const fs = require("fs/promises");
const upload = require("../utils/cloudinary-service");
const { updateProductSchema } = require("../validators/product-validator");

exports.addProduct = async (req, res, next) => {
  try {
    if (req.file) {
      const url = await upload(req.file.path);

      const productObject = Object.assign({}, req.body, {
        productImage: url,
      });
      const product = await prisma.product.create({ data: productObject });
      res.status(201).json({ message: "Product was created", product });
    }
    res.end();
  } catch (err) {
    console.log(err);
    next(err);
  } finally {
    if (req.file) {
      fs.unlink(req.file.path);
    }
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({});
    res.status(200).json({ message: "get products", products });
  } catch (err) {
    next(err);
  }
};

exports.findProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await prisma.product.findFirst({
      where: { id: +productId },
    });
    res.status(200).json({ product });
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    await prisma.product.delete({
      where: {
        id: +productId,
      },
    });
    res.end();
    res.status(200).status({ message: "Product was deleted" });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    console.log("asdafsda");
    const { value, error } = updateProductSchema.validate(req.body);
    if (error) {
      return next(createError(error.details[0].message, 400));
    }
    console.log(value, "sdfsdfdsf");
    const updatedProduct = await prisma.product.update({
      data: value,
      where: {
        id: +req.params.id,
      },
    });

    res.status(200).json({ message: "Product was updated", updatedProduct });
  } catch (error) {
    next(error);
  }
};
