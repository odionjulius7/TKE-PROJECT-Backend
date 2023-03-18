const express = require("express");
// const authMiddleware = require("../middleware/authentication");
const {
  getAllTrip,
  getSingleTrip,
  createTrip,
  updateTrip,
  deleteTrip,
  createOverView,
  getUserTrips,
  createFlightDetails,
  createVisa,
  createAgreement,
  createPayment,
  createTravelConfrimation,
  createItinerary,
} = require("../controllers/trip");

const authMiddleware = require("../middleware/authentication");
const router = express.Router();

router.route("/").get(getAllTrip);
router
  .route("/:id")
  .post(authMiddleware, createTrip)
  .get(authMiddleware, getSingleTrip)
  .patch(updateTrip)
  .delete(deleteTrip);

router.route("/user/:id").get(getUserTrips);

router.route("/:id/overview").post(createOverView);
router.route("/:id/flightDetails").post(createFlightDetails);
router.route("/:id/flightDetails").post(createFlightDetails);
router.route("/:id/visa").post(createVisa);
router.route("/:id/agreement").post(createAgreement);
router.route("/:id/payment").post(createPayment);
router.route("/:id/confirmation").post(createTravelConfrimation);
router.route("/:id/itinerary").post(createItinerary);
module.exports = router;
