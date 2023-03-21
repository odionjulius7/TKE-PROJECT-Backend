const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const dotenv = require("dotenv");
// const multer = require("multer");
// const asyncError = require("express-async-errors");
// require("dotenv").config();
require("express-async-errors");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// file import
const connectDB = require("./db/connect");
const authRoute = require("./routes/auth");
const TripRequestRoute = require("./routes/tripRequest");
const TripRoute = require("./routes/trip");
const generalBannerRoute = require("./routes/generalBanner");

const port = process.env.PORT || 4000;
// Load environment variables
dotenv.config();
// const upload = multer();
const app = express();

// Middleware
// app.use(morgan("tiny"));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Use the `multer` middleware to handle `multipart/form-data` requests
// app.use(upload.any());
// Routes
app.get("/", (req, res) => {
  res.status(StatusCodes.OK).send("Hello, World!");
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/trip/request", TripRequestRoute);
app.use("/api/v1/trip", TripRoute);
app.use("/api/v1/general", generalBannerRoute);

// Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(httpStatus.INTERNAL_SERVER_ERROR).send('Something went wrong!');
// });

// errors
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
