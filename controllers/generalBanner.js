const GeneralBanner = require("../models/GeneralBanner");
const cloudinary = require("../utils/cloudinary");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../errors");
const { StatusCodes } = require("http-status-codes");

const addGeneralBanner = async (req, res) => {
  const generalBanner = await GeneralBanner.find();
  //   res.send({ generalBanner });
  try {
    if (generalBanner.length === 1) {
      await cloudinary.uploader.destroy(generalBanner[0].cloudinary_id);
    }
    await GeneralBanner.deleteMany({});
    const result = await cloudinary.uploader.upload(req.file.path);

    const newGeneralBanner = new GeneralBanner({
      imgURL: result.secure_url,
      cloudinary_id: result.public_id,
    });

    await newGeneralBanner.save(); // Call save on the instance

    return res.status(StatusCodes.OK).json({
      message: "General banner saved successfully",
      newGeneralBanner,
    });
  } catch (error) {
    console.error(error);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "An error occurred while saving general banner" });
  }
};

//
const getGeneralBanner = async (req, res) => {
  try {
    const generalBanner = await GeneralBanner.find();
    return res.status(StatusCodes.OK).json({ generalBanner });
  } catch (error) {
    console.error(error);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "An error occurred while retrieving general banner" });
  }
};

module.exports = { addGeneralBanner, getGeneralBanner };

// const newGeneralBanner = new GeneralBanner({
//     imgURL: result.secure_url, // fixed reference to secure_url
//     cloudinary_id: result.public_id, // fixed reference to public_id
//   });
//   await newGeneralBanner.save();
