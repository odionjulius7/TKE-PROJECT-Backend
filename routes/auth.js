const express = require("express");

const upload = require("../utils/multer");
const {
  register,
  loginAdmin,
  loginUser,
  getUser,
  getSingleUser,
  editUserDetails,
  registerUser,
  registerAdmin,
  addUserBanner,
  changePassword,
} = require("../controllers/auth");
const authMiddleware = require("../middleware/authentication");

const router = express.Router();

router.route("/users").get(authMiddleware, getUser);
router
  .route("/user/:email")
  .get(getSingleUser)
  .patch(authMiddleware, editUserDetails);
//
router.route("/register/user").post(authMiddleware, registerUser);
router.route("/change/password").post(authMiddleware, changePassword);
//
router.route("/register/admin").post(registerAdmin);
router.route("/login/admin").post(loginAdmin);
router.route("/login/user").post(loginUser);

// add user banner
router.route("/users/:userId").post(upload.single("banner"), addUserBanner);

module.exports = router;
