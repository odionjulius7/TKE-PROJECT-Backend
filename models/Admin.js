const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Schema = mongoose.Schema;
const AdminSchema = new Schema({
  userName: {
    type: String,
    required: [true, "Please, provide username"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please, provide password"],
    unique: true,
  },

  role: {
    type: String,
    // enum: ["user", "admin"],
    default: "admin",
  },
});

UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { adminId: this._id, userName: this.userName },
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

module.exports = mongoose.model("User", AdminSchema);
