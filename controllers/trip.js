const Trip = require("../models/Trip");
const User = require("../models/User");
const cloudinary = require("../utils/cloudinary");
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

  const tripsByMonth = {};

  // Iterate over items and add them to corresponding month arrays
  trips.forEach((item) => {
    const month = item.createdAt.getMonth();
    const monthName = new Intl.DateTimeFormat("en-US", {
      month: "short",
    }).format(item?.createdAt);

    if (!tripsByMonth[monthName]) {
      tripsByMonth[monthName] = [];
    }

    tripsByMonth[monthName].push(item);
  });

  console.log(tripsByMonth);

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
  const { startDate, endDate, title, description } = req.body;

  // res.json({ image: req.file.path, data: req.body, tripId });

  try {
    const trip = await Trip.findById(tripId);
    // delete the image from cloudinary cloud before adding a new review to avoid over loading cloudinary with so many image
    // if (trip.overview.cloudinary_id) {
    //   await cloudinary.uploader.destroy(trip.overview.cloudinary_id);
    // }
    if (!trip) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Trip not found" });
    }
    const result = await cloudinary.uploader.upload(req.file.path);

    const overviewData = {
      image: result.secure_url,
      startDate,
      endDate,
      title,
      description,
      cloudinary_id: result.public_id,
    };

    trip.overview = overviewData;

    await trip.save();
    console.log(startDate);
    return res
      .status(StatusCodes.OK)
      .json({ message: "Overview data saved successfully", overviewData });
  } catch (error) {
    console.error(error);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "An error occurred while saving overview data" });
  }
};

// flight details
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
      .json({ message: "Flight details saved successfully", flightData });
  } catch (error) {
    console.error(error);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "An error occurred while saving flight details data" });
  }
};

const updateFlightDetails = async (req, res) => {
  const tripId = req.params.tripId;
  const flightData = req.body;
  const flightId = req.params.flightId; // id of the flight to be updated

  try {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Trip not found" });
    }

    // looking for the index position of the flight details' id
    const flightIndex = trip.flightDetails.findIndex(
      (flight) => flight.id === flightId
    );

    if (flightIndex === -1) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Flight detail not found" });
    }

    // Update the flight at the specified index
    // trip.flightDetails[flightIndex] = flightData;
    trip.flightDetails[flightIndex] = {
      ...trip.flightDetails[flightIndex],
      ...flightData,
    };

    await trip.save();
    return res.status(StatusCodes.OK).json({
      message: "Flight details updated successfully",
      flightData,
    });
  } catch (error) {
    console.error(error);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "An error occurred while updating flight details data" });
  }
};

const deleteFlightDetails = async (req, res) => {
  const tripId = req.params.tripId;
  const flightId = req.params.flightId; // id of the flight to be updated

  try {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Trip not found" });
    }

    // looking for the index position of the flight details' id
    const flightIndex = trip.flightDetails.findIndex(
      (flight) => flight.id === flightId
    );
    if (flightIndex === -1) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Flight detail not found" });
    }

    // trip.flightDetails.splice(flightIndex, 1);

    trip.flightDetails = trip.flightDetails.filter(
      (flight) => flight.id !== flightId
    );

    // Update the flight at the specified index
    // trip.flightDetails[flightIndex] = flightData;

    await trip.save();
    return res.status(StatusCodes.OK).json({
      message: "Flight details deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "An error occurred while deleting flight details data" });
  }
};

// Visa
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
      .json({ message: "Visa saved successfully", visaData });
  } catch (error) {
    console.error(error);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "An error occurred while saving visa data" });
  }
};

const updateVisa = async (req, res) => {
  const tripId = req.params.tripId;
  const visaData = req.body;
  const visaId = req.params.visaId;

  try {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Trip not found" });
    }

    const visaIndex = trip.visa.findIndex((visa) => visa.id === visaId);

    if (visaIndex === -1) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Visa not found" });
    }

    trip.visa[visaIndex] = {
      ...trip.visa[visaIndex],
      ...visaData,
    };

    await trip.save();
    return res.status(StatusCodes.OK).json({
      message: "Visa updated successfully",
      visaData,
    });
  } catch (error) {
    console.error(error);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "An error occurred while updating visa  data" });
  }
};

const deleteVisa = async (req, res) => {
  const tripId = req.params.tripId;
  const visaId = req.params.visaId;

  try {
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Trip not found" });
    }
    const visaIndex = trip.visa.findIndex((visa) => visa.id === visaId);
    if (visaIndex === -1) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Visa not found" });
    }

    // trip.visa.splice(visaIndex, 1);

    trip.visa = trip.visa.filter((visa) => visa.id !== visaId);

    await trip.save();
    return res.status(StatusCodes.OK).json({
      message: "Visa deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "An error occurred while deleting Visa data" });
  }
};

// Agreement
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
      .json({ message: "Agreement saved successfully", agreementData });
  } catch (error) {
    console.error(error);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "An error occurred while saving Agreement data" });
  }
};

const updateAgreement = async (req, res) => {
  const tripId = req.params.tripId;
  const agreementData = req.body;
  const agreementId = req.params.agreementId;

  try {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Trip not found" });
    }

    const agreementIndex = trip.agreements.findIndex(
      (agreement) => agreement.id === agreementId
    );

    if (agreementIndex === -1) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Agreement not found" });
    }

    trip.agreements[agreementIndex] = {
      ...trip.agreements[agreementIndex],
      ...agreementData,
    };

    await trip.save();
    return res.status(StatusCodes.OK).json({
      message: "Agreement updated successfully",
      agreementData,
    });
  } catch (error) {
    console.error(error);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "An error occurred while updating agreement data" });
  }
};

const deleteAgreement = async (req, res) => {
  const tripId = req.params.tripId;
  const agreementId = req.params.agreementId;

  try {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Trip not found" });
    }

    const agreementIndex = trip.agreements.findIndex(
      (agreement) => agreement.id === agreementId
    );
    if (agreementIndex === -1) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Agreement not found" });
    }

    trip.agreements = trip.agreements.filter(
      (agreement) => agreement.id !== agreementId
    );

    await trip.save();
    return res.status(StatusCodes.OK).json({
      message: "Agreement deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "An error occurred while deleting agreement data" });
  }
};

// Payment
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

const updatePayment = async (req, res) => {
  const tripId = req.params.tripId;
  const paymentData = req.body;
  const paymentId = req.params.paymentId;

  try {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Trip not found" });
    }

    const paymentIndex = trip.payment.findIndex(
      (payment) => payment.id === paymentId
    );

    if (paymentIndex === -1) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "payment not found" });
    }

    trip.payment[paymentIndex] = {
      ...trip.payment[paymentIndex],
      ...paymentData,
    };

    await trip.save();
    return res.status(StatusCodes.OK).json({
      message: "Payment updated successfully",
      paymentData,
    });
  } catch (error) {
    console.error(error);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "An error occurred while updating payment data" });
  }
};

const deletePayment = async (req, res) => {
  const tripId = req.params.tripId;
  const paymentId = req.params.paymentId;

  try {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Trip not found" });
    }

    const paymentIndex = trip.payment.findIndex(
      (payment) => payment.id === paymentId
    );
    if (paymentIndex === -1) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "pament not found" });
    }

    // trip.payment.splice(paymentIndex, 1);

    trip.payment = trip.payment.filter((payment) => payment.id !== paymentId);

    await trip.save();
    return res.status(StatusCodes.OK).json({
      message: "payment deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "An error occurred while deleting payment data" });
  }
};

// Travel Confirmation
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
    return res.status(StatusCodes.OK).json({
      message: "Travel confirmation saved successfully",
      confirmationData,
    });
  } catch (error) {
    console.error(error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "An error occurred while saving Travel confirmation data",
    });
  }
};

const updateTravelConfrimation = async (req, res) => {
  const tripId = req.params.tripId;
  const confrimationData = req.body;
  const confrimationId = req.params.confrimationId;

  try {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Trip not found" });
    }

    const confrimationIndex = trip.travelConfirmation.findIndex(
      (confrimation) => confrimation.id === confrimationId
    );

    if (confrimationIndex === -1) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Travel confirmation not found" });
    }

    trip.travelConfirmation[confrimationIndex] = {
      ...trip.travelConfirmation[confrimationIndex],
      ...confrimationData,
    };

    await trip.save();
    return res.status(StatusCodes.OK).json({
      message: "Travel confirmation updated successfully",
      confrimationData,
    });
  } catch (error) {
    console.error(error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "An error occurred while updating travel confirmation data",
    });
  }
};

const deleteTravelConfrimation = async (req, res) => {
  const tripId = req.params.tripId;
  const confrimationId = req.params.confrimationId;

  try {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Trip not found" });
    }

    const confrimationIndex = trip.travelConfirmation.findIndex(
      (confrimation) => confrimation.id === confrimationId
    );
    if (confrimationIndex === -1) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "confrimation detail not found" });
    }

    trip.travelConfirmation.splice(confrimationIndex, 1);

    // trip.travelConfirmation = trip.travelConfirmation.filter(
    //   (confrimation) => confrimation.id !== confrimationId
    // );

    await trip.save();
    return res.status(StatusCodes.OK).json({
      message: "Travel confirmation deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "An error occurred while deleting travel confirmation data",
    });
  }
};

// End of Travel Confirmation

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
      .json({ message: "Itinarary saved successfully", itineraryData });
  } catch (error) {
    console.error(error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "An error occurred while saving itinarary data",
    });
  }
};

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
  // updates
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

// Object to store items by month
// const tripByMonth = {};

// Iterate over items and add them to corresponding month arrays
// trips.forEach((item) => {
//   const month = item.createdAt.getMonth();
//   const monthName = new Intl.DateTimeFormat("en-US", {
//     month: "short",
//   }).format(item.createdAt);

//   if (!tripByMonth[monthName]) {
//     tripByMonth[monthName] = [];
//   }

//   tripByMonth[monthName].push(item);
// });

// console.log(tripByMonth);
