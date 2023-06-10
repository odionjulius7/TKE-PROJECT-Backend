const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads/"));
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
  if (file.mimetype.startsWith("image") || file.mimetype.startsWith("video")) {
    cb(null, true);
  } else {
    cb({ message: "Unsupported file format" }, false);
  }
};

const uploadFiles = multer({
  storage: storage,
  fileFilter: multerFilter,
  limits: { fileSize: 10000000 }, // 10MB limit for each file
}).array("files", 5); // Upload up to 5 files, adjust the limit as needed

// Middleware for file upload
const handleFileUpload = (req, res, next) => {
  uploadFiles(req, res, function (err) {
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

app.post("/upload", handleFileUpload, async (req, res) => {
  // Access the uploaded files using req.files
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  try {
    const uploadedFiles = [];

    // Upload each file to Cloudinary
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path);

      // Store the Cloudinary public ID and URL of the uploaded file
      uploadedFiles.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    // Process the uploaded files or perform further operations
    // You can save the public IDs and URLs to your database or perform any other required tasks

    res.status(200).json({ message: "Files upload successful", uploadedFiles });
  } catch (error) {
    console.error("Error uploading files to Cloudinary:", error);
    return res.status(500).json({ error: "Error uploading files" });
  }
});
