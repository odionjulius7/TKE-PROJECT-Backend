const TripRequest = require("../models/TripRequest");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const {
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
} = require("../errors");
const jwt = require("jsonwebtoken");

const getAllTripRequest = async (req, res) => {
  const tripRequests = await TripRequest.find({});
  console.log(tripRequests);
  res.status(StatusCodes.OK).json({ tripRequests, count: tripRequests.length });
};

const getSingleTripRequest = async (req, res) => {
  const tripRequestId = req.params.id;
  const tripRequest = await TripRequest.findOne({ _id: tripRequestId });

  if (!tripRequest) {
    throw new NotFoundError(`No Trip Request With Such id ${tripRequestId}`);
  }
  res.status(StatusCodes.OK).json({ tripRequest });
};

const createTripRequest = async (req, res) => {
  let user;
  let tripRequestData = req.body;

  // Check for authorization header
  const authHeader = req.headers["authorization"];

  if (authHeader && authHeader.startsWith("Bearer ")) {
    // Extract token from authorization header
    const token = authHeader.split(" ")[1];

    try {
      // Verify token and get user
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log(decoded);
      user = await User.findById(decoded.userId).select("-password");
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid token" });
      return;
    }

    // Add user object to tripRequestData
    tripRequestData.user = {
      ...user.toObject(), // we don't really need the toObject() since the user isn't null or undefined that we want to explicitly create an empty object {}
      userType: "user",
    };
  }

  const tripRequest = await TripRequest.create(tripRequestData);
  // const tripRequest = await TripRequest.create(req.body);

  res.status(StatusCodes.CREATED).json(tripRequest);
};

const updateTripRequestAsSeen = async (req, res) => {
  const tripRequestId = req.params.id;

  // Note that you can update any other fields in the TripRequest document using a similar approach,
  //  simply by changing the $set operator to the appropriate update operator for the type of update you wish to
  // perform (e.g. $inc for incrementing a numeric field, $push for adding an item to an array field, etc.).
  const updatedTripRequest = await TripRequest.findOneAndUpdate(
    { _id: tripRequestId },
    { $set: { requestStatus: "old" } },
    { new: true }
  );

  if (!updatedTripRequest) {
    throw new NotFoundError(`No Trip Request With Such id ${tripRequestId}`);
  }
  res
    .status(StatusCodes.OK)
    .json({ message: "Trip request update", updatedTripRequest });
};
const deleteTripRequest = async (req, res) => {
  const tripRequestId = req.params.id;

  const deletedTripRequest = await TripRequest.findOneAndDelete({
    _id: tripRequestId,
  });

  if (!deletedTripRequest) {
    throw new NotFoundError(`No Trip Request With Such id ${tripRequestId}`);
  }
  res
    .status(StatusCodes.OK)
    .json({ message: "Trip request deleted", tripRequest: deletedTripRequest });
};

module.exports = {
  getAllTripRequest,
  getSingleTripRequest,
  createTripRequest,
  deleteTripRequest,
  updateTripRequestAsSeen,
};
