const mongoose = require("mongoose");

const TripRequestSchema = new mongoose.Schema(
  {
    user: {
      firstName: { type: String },
      lastName: { type: String },
      email: { type: String },
      phoneNumber: { type: String },
      gender: { type: String },
      dateOfBirth: {
        type: Date,
      },
      postCode: {
        type: String,
      },
      userType: {
        type: String,
        enum: ["prospect", "user"],
        default: "prospect",
      },
    },
    tripType: {
      type: String,
      enum: ["bespoke", "destination"],
      required: true,
    },
    tripDetails: {
      // destination
      occationYouAreCelebrating: { type: String },
      likeToCelebrateWhat: { type: String },
      estimateGuestToCelebrateWith: { type: Number },
      AdultsCeleberatingWith: { type: Number },
      childrenCelebratingWith: { type: Number },
      whatCityYouMostLikelyExpectQuests: { type: String },
      daysToSpendCelebrating: { type: Number },
      setDateForCel: { type: String },
      whatTKEServiceDoYouWant: { type: String },
      anythingElseAboutCelebration: { type: String },
      howSoonDoYouWantToBook: { type: String },
      // bespoke
      whereTo: String,
      needVisa: Boolean,
      whatCity: String,
      daysLikelyToSpend: String,
      anyDateSet: String,
      enterDateToTravel: String,
      enterDateToArrive: String,
      ideaMonthYear: String,
      travelForWhat: String,
      travelWithWho: String,
      numberOfTravellerAdult: Number,
      numberOfTravellerKids: Number,
      choiceActivityWhileTravelling: [String],
    },
    requestStatus: {
      type: String,
      enum: ["new", "old"],
      default: "new",
    },
  },
  { timestamps: true }
);

const TripRequest = mongoose.model("TripRequest", TripRequestSchema);

module.exports = TripRequest;
