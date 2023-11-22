const express = require("express");
const router = express.Router();
const shoppingCartController = require("../controllers/shoppingCart-controller");
const authenticateMiddleware = require("../middlewares/authenticate");

router.get(
  "/get",
  authenticateMiddleware,
  shoppingCartController.getShoppingCart
);

router.post(
  "/create",
  authenticateMiddleware,
  shoppingCartController.createShoppingCart
);

router.post(
  "/update",
  authenticateMiddleware,
  shoppingCartController.updateShoppingCart
);

router.delete(
  "/:deleteId",
  authenticateMiddleware,
  shoppingCartController.deleteShoppingCart
);
router.get(
  "/checkout",
  authenticateMiddleware,
  shoppingCartController.CheckOutShoppingCart
);

module.exports = router;
