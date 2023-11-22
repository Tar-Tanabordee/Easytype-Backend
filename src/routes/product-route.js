const express = require("express");
const router = express.Router();
const uploadMiddleware = require("../middlewares/upload");
const productController = require("../controllers/product-controller");

router.post(
  "/add",
  uploadMiddleware.single("productImage"),
  productController.addProduct
);

router.get("/get", productController.getProducts);
router.get("/:productId", productController.findProduct);
router.patch(
  "/updateProduct/:id",
  uploadMiddleware.single("productImage"),
  productController.updateProduct
);
router.delete("/deleteProduct/:productId", productController.deleteProduct);

module.exports = router;
