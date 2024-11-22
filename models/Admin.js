const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
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
    default: "admin",
  },
});

AdminSchema.pre("save", async function (next) {
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);

  next();
});

AdminSchema.methods.createJWT = function () {
  return jwt.sign(
    { adminId: this._id, userName: this.userName },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

AdminSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcryptjs.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("Admin", AdminSchema);
