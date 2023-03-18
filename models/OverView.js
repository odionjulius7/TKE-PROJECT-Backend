const mongoose = require("mongoose");

const OverviewSchema = new mongoose.Schema({
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
  //   trip: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Trip",
  //     required: true,
  //   },
});

const overview = mongoose.model("overview", OverviewSchema);

module.exports = overview;
