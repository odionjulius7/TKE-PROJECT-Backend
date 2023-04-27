const path = require("path");
const multer = require("multer");

// set up multer for file upload
const storage = multer.diskStorage({});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 }, // 10 MB limit
  fileFilter: (req, file, callback) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      callback(null, true);
    } else {
      callback(
        new Error(
          "Invalid file type. Only JPEG, JPG, PNG and GIF files are allowed."
        )
      );
    }
  },
});
// .single("banner");

module.exports = {
  upload,
};

// add user banner
// const addUserBanner = async (req, res) => {
//   const userId = req.params.userId;
//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(StatusCodes.NOT_FOUND).json({ error: 'User not found' });
//     }
//     upload(req, res, async (error) => {
//       if (error) {
//         console.error(error);
//         return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
//       }
//       const result = await cloudinary.uploader.upload(req.file.path);
//       const userBanner = {
//         imgURL: result.secure_url,
//         cloudinary_id: result.public_id,
//       };
//       user.banner = userBanner;
//       await user.save();
//       return res.status(StatusCodes.OK).json({ message: 'User banner saved successfully', userBanner });
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred while saving user banner data' });
//   }
// };
