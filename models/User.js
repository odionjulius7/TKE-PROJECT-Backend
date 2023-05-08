const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, "Please, provide email"],
    unique: true,
    trim: true,
  },
  gender: { type: String },
  phoneNumber: { type: String },
  password: {
    type: String,
  },
  firstName: {
    type: String,
    required: [true, "Please, provide first name"],
  },
  lastName: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
  },
  postCode: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  banner: {
    imgURL: {
      type: String,
    },
    cloudinary_id: {
      type: String,
    },
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, email: this.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

// const User = mongoose.model("User", userSchema);

module.exports = mongoose.model("User", UserSchema);
