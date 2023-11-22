const express = require("express");
const authenticateMiddleware = require("../middlewares/authenticate");
const router = express.Router();

const addressController = require("../controllers/address-controller");

router.post("/create", authenticateMiddleware, addressController.createAddress);
router.get("/get", authenticateMiddleware, addressController.getAddress);

module.exports = router;
