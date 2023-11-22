const express = require("express");

const authController = require("../controllers/auth-controllers");
const authenticateMiddleware = require("../middlewares/authenticate");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.patch(
  "/updateProfile",
  authenticateMiddleware,
  authController.updateProfile
);
router.post("/admin/register", authController.adminRegister);
router.post("/admin/login", authController.adminLogin);
router.get("/get", authenticateMiddleware, authController.getUser);

module.exports = router;
