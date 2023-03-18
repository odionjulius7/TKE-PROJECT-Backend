const express = require("express");
// const authMiddleware = require("../middleware/authentication");
const {
  getAllTripRequest,
  getSingleTripRequest,
  createTripRequest,
  deleteTripRequest,
  updateTripRequestAsSeen,
} = require("../controllers/tripRequest");
const router = express.Router();

router.route("/").post(createTripRequest).get(getAllTripRequest);
router
  .route("/:id")
  .get(getSingleTripRequest)
  .patch(updateTripRequestAsSeen)
  .delete(deleteTripRequest);

module.exports = router;
