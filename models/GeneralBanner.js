const mongoose = require("mongoose");

const GeneralBannerSchma = new mongoose.Schema({
  // generalBanner: {
  imgURL: {
    type: String,
  },
  cloudinary_id: {
    type: String,
  },
  // },
});

module.exports = mongoose.model("generalBanner", GeneralBannerSchma);
