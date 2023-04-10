const mongoose = require("mongoose");

const flightDetailsSchema = new mongoose.Schema({
  location: {
    type: String,
  },
  date: {
    type: Date,
  },
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trip",
  },
});

const paymentSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  amount: {
    type: String,
  },
  date: {
    type: Date,
  },
  payment_link: {
    type: String,
  },
  receipt_link: {
    type: String,
  },
  invoice_link: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Not Paid", "Paid"],
    default: "Not Paid",
  },
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trip",
  },
});

const agreementSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  document_link: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Not Signed", "Signed"],
    default: "Not Signed",
  },
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trip",
  },
});

const travelConfirmationSchema = new mongoose.Schema({
  title: { type: String },
  document_link: {
    type: String,
  },
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trip",
  },
});

const overviewSchema = new mongoose.Schema({
  image: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  cloudinary_id: {
    type: String,
  },
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trip",
  },
});

const visaSchema = new mongoose.Schema({
  title: { type: String },
  document_link: {
    type: String,
  },
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trip",
  },
});

const itinerarySchema = new mongoose.Schema({
  data: { type: String },
  trip: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Trip",
  },
});

// Trip
const tripSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true,
  },
  overview: {
    type: overviewSchema,
  },
  itinerary: {
    type: itinerarySchema,
  },
  visa: {
    type: [visaSchema],
  },
  flightDetails: {
    type: [flightDetailsSchema],
  },
  agreements: [agreementSchema],
  payment: {
    type: [paymentSchema],
  },
  travelConfirmation: {
    type: [travelConfirmationSchema],
  },
});

const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;
