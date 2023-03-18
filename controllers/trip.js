const Trip = require("../models/Trip");
const User = require("../models/User");
// const OverView = require("../models/OverView");
const { StatusCodes } = require("http-status-codes");

const {
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
} = require("../errors");
const jwt = require("jsonwebtoken");

const getAllTrip = async (req, res) => {
  const trips = await Trip.find({});

  res.status(StatusCodes.OK).json({ trips, count: trips.length });
};

const getUserTrips = async (req, res) => {
  const userId = req.params.id;
  const trips = await Trip.find({ user: userId });

  res.status(StatusCodes.OK).json({ trips, count: trips.length });
};

const getSingleTrip = async (req, res) => {
  const tripId = req.params.id;
  const trip = await Trip.findOne({ _id: tripId })
    .populate("overview")
    .populate("itinerary")
    .populate("visa")
    .populate("flightDetails")
    .populate("agreements")
    .populate("payment")
    .populate("travelConfirmation");

  if (!trip) {
    throw new NotFoundError(`Trip with this id ${tripId} not found`);
  }

  res.status(StatusCodes.OK).json({ trip });
};

const createTrip = async (req, res) => {
  const userId = req.params.id;
  const user = await User.findOne({ _id: userId }).select("-password");

  if (!user) {
    throw new NotFoundError(`User with the id ${userId} not found`);
  }

  // const tripData = req.body;

  const trip = await Trip.create({ user: user._id });
  // Trip.create({ user: userId, ...tripData })
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Trip created successfully.....", trip });
};

const updateTrip = async (req, res) => {
  res.send("update trip");
};
const deleteTrip = async (req, res) => {
  res.send("delete trip");
};

// create trip items

const createOverView = async (req, res) => {
  const tripId = req.params.id;
  const overviewData = req.body;

  try {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Trip not found" });
    }

    trip.overview = overviewData;

    await trip.save();

    console.log("Overview data saved successfully");

    return res
      .status(StatusCodes.OK)
      .json({ message: "Overview data saved successfully" });
  } catch (error) {
    console.error(error);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "An error occurred while saving overview data" });
  }
};

const createFlightDetails = async (req, res) => {
  const tripId = req.params.id;
  const flightData = req.body;

  try {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Trip not found" });
    }

    trip.flightDetails.push(flightData);

    await trip.save();
    return res
      .status(StatusCodes.OK)
      .json({ message: "Flight details saved successfully" });
  } catch (error) {
    console.error(error);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "An error occurred while saving flight details data" });
  }
};

const createVisa = async (req, res) => {
  const tripId = req.params.id;
  const visaData = req.body;

  try {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Trip not found" });
    }

    trip.visa.push(visaData);

    await trip.save();
    return res
      .status(StatusCodes.OK)
      .json({ message: "Visa saved successfully" });
  } catch (error) {
    console.error(error);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "An error occurred while saving visa data" });
  }
};

const createAgreement = async (req, res) => {
  const tripId = req.params.id;
  const agreementData = req.body;

  try {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Trip not found" });
    }

    trip.agreements.push(agreementData);

    await trip.save();
    return res
      .status(StatusCodes.OK)
      .json({ message: "Agreement saved successfully" });
  } catch (error) {
    console.error(error);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "An error occurred while saving Agreement data" });
  }
};

const createPayment = async (req, res) => {
  const tripId = req.params.id;
  const paymentData = req.body;

  try {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Trip not found" });
    }

    trip.payment.push(paymentData);

    await trip.save();
    return res
      .status(StatusCodes.OK)
      .json({ message: "Payment saved successfully" });
  } catch (error) {
    console.error(error);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "An error occurred while saving Payment data" });
  }
};

const createTravelConfrimation = async (req, res) => {
  const tripId = req.params.id;
  const confirmationData = req.body;

  try {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Trip not found" });
    }

    trip.travelConfirmation.push(confirmationData);

    await trip.save();
    return res
      .status(StatusCodes.OK)
      .json({ message: "Travel confirmation saved successfully" });
  } catch (error) {
    console.error(error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "An error occurred while saving Travel confirmation data",
    });
  }
};

const createItinerary = async (req, res) => {
  const tripId = req.params.id;
  const itineraryData = req.body;

  try {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Trip not found" });
    }

    trip.itinerary = itineraryData;

    await trip.save();
    return res
      .status(StatusCodes.OK)
      .json({ message: "Itinarary saved successfully" });
  } catch (error) {
    console.error(error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "An error occurred while saving itinarary data",
    });
  }
};

// const createOverView = async (req, res) => {
//   const tripId = req.params.id;
//   const trip = await Trip.findOne({ _id: tripId }).select("-password");

//   if (!trip) {
//     throw new NotFoundError(`Trip with the id ${tripId} not found`);
//   }

//   const overviewData = req.body;
//   overviewData.trip = tripId;

//   const overview = await OverView.create(overviewData);

//   res.status(StatusCodes.CREATED).json({
//     message: "Overview created successfully",
//     overview,
//   });
// };

module.exports = {
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
};

// const tripId = req.params.id;

// const overviewData = {
//   image: "https://example.com/image.jpg",
//   title: "Overview title",
//   description: "Overview description",
// };

// try {
//   const trip = await Trip.findById(tripId);

//   if (!trip) {
//     console.error("Trip not found");
//     return;
//   }

//   trip.overview.push(overviewData);

//   await trip.save();

//   console.log("Overview data saved successfully");
// } catch (err) {
//   console.error(err);
// }
