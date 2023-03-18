const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
// const mongoose = require("mongoose");
const httpStatus = require("http-status-codes");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
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

const port = process.env.PORT || 4000;
// Load environment variables
dotenv.config();
const app = express();

// Middleware
// app.use(morgan("tiny"));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.status(StatusCodes.OK).send("Hello, World!");
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/trip/request", TripRequestRoute);
app.use("/api/v1/trip", TripRoute);

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
