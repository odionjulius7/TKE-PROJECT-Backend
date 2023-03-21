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
  //
  updateFlightDetails,
  deleteFlightDetails,
  updatePayment,
  deletePayment,
  updateTravelConfrimation,
  deleteTravelConfrimation,
  updateAgreement,
  deleteAgreement,
  updateVisa,
  deleteVisa,
} = require("../controllers/trip");
const upload = require("../utils/multer");

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

router.route("/:id/overview").post(upload.single("image"), createOverView);
// flight details
router.route("/:id/flightDetails").post(createFlightDetails);
// The main difference between PATCH and PUT is that PATCH is typically used for
// making partial updates to a resource, while PUT is used for completely replacing a resource.
router.route("/:tripId/flightDetails/:flightId").patch(updateFlightDetails);
router.route("/:tripId/flightDetails/:flightId").delete(deleteFlightDetails);
// End flight details

router.route("/:id/visa").post(createVisa);
router.route("/:tripId/visa/:visaId").put(updateVisa);
router.route("/:tripId/visa/:visaId").delete(deleteVisa);
//
router.route("/:id/agreement").post(createAgreement);
router.route("/:tripId/agreement/:agreementId").put(updateAgreement);
router.route("/:tripId/agreement/:agreementId").delete(deleteAgreement);

//

router.route("/:id/payment").post(createPayment);
router.route("/:tripId/payment/:paymentId").patch(updatePayment);
router.route("/:tripId/payment/:paymentId").delete(deletePayment);
//
router.route("/:id/confirmation").post(createTravelConfrimation);
router
  .route("/:tripId/confirmation/:confrimationId")
  .put(updateTravelConfrimation);
router
  .route("/:tripId/confirmation/:confrimationId")
  .delete(deleteTravelConfrimation);
//
router.route("/:id/itinerary").post(createItinerary);
module.exports = router;
