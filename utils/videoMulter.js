const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/videos/"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("video")) {
    cb(null, true);
  } else {
    cb({ message: "Unsupported file format" }, false);
  }
};

const uploadVideo = multer({
  storage: storage,
  fileFilter: multerFilter,
  limits: { fileSize: 10000000 }, // 10MB limit for video file size
}).single("video");

// Middleware for video upload
const handleVideoUpload = (req, res, next) => {
  uploadVideo(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred during file upload
      return res.status(400).json({ error: err.message });
    } else if (err) {
      // An unknown error occurred during file upload
      return res.status(500).json({ error: "Internal server error" });
    }
    // File upload successful
    next();
  });
};

// Example route for video upload
app.post("/upload", handleVideoUpload, (req, res) => {
  // Access the uploaded video using req.file
  if (!req.file) {
    return res.status(400).json({ error: "No video file uploaded" });
  }

  // Process the uploaded video or perform further operations

  res.status(200).json({ message: "Video upload successful" });
});
