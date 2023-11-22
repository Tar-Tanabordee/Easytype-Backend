const express = require("express");
const router = express.Router();

const authenticateMiddleware = require("../middlewares/authenticate");
const uploadMiddleware = require("../middlewares/upload");

const orderController = require("../controllers/order-controller");

router.get("/get/:orderId", authenticateMiddleware, orderController.getOrder);
router.get("/getAll", authenticateMiddleware, orderController.getAllOrder);
router.post(
  "/createOrder",
  authenticateMiddleware,
  orderController.createOrder
);

router.post("/payment", authenticateMiddleware, orderController.checkoutOrder);
router.patch(
  "/paid/:paymentId",
  authenticateMiddleware,
  uploadMiddleware.single("slip"),
  orderController.paidOrder
);

module.exports = router;
