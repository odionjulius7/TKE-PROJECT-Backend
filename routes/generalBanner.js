const express = require("express");
const upload = require("../utils/multer");
const authMiddleware = require("../middleware/authentication");

const {
  addGeneralBanner,
  getGeneralBanner,
} = require("../controllers/generalBanner");

const router = express.Router();

router.route("/banner").post(upload.single("generalBanner"), addGeneralBanner);
router.route("/banner").get(getGeneralBanner);

module.exports = router;
