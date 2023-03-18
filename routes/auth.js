const express = require("express");

const {
  register,
  loginAdmin,
  loginUser,
  getUser,
  getSingleUser,
  editUserDetails,
  registerUser,
  registerAdmin,
} = require("../controllers/auth");
const authMiddleware = require("../middleware/authentication");
const router = express.Router();

router.route("/users").get(authMiddleware, getUser);
router
  .route("/user/:email")
  .get(getSingleUser)
  .patch(authMiddleware, editUserDetails);
router.route("/register/user").post(authMiddleware, registerUser);
router.route("/register/admin").post(registerAdmin);
router.route("/login/admin").post(loginAdmin);
router.route("/login/user").post(loginUser);

module.exports = router;
