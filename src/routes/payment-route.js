const express = require("express");
const authenticateMiddleware = require("../middlewares/authenticate");
const paymentController = require("../controllers/payment-controller");
const router = express.Router();

router.patch(
  "/userConfirm",
  authenticateMiddleware,
  paymentController.confirmOrder
);

router.patch(
  "/adminConfirm",
  authenticateMiddleware,
  paymentController.adminConfirm
);

module.exports = router;
