const { StatusCodes } = require("http-status-codes");
const sgMail = require("@sendgrid/mail");

const passwordGenerator = require("password-generator");
const User = require("../models/User");

const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../errors");
const bcrypt = require("bcrypt");

const getUser = async (req, res) => {
  const { email } = req.user;
  const user = await User.findOne({ email });

  console.log(req.user);

  if (user.role === "user") {
    throw new UnauthenticatedError(
      "Unauthorize credential, This is not an admin account"
    );
  }

  const users = await User.find(
    {},
    "email firstName lastName dateOfBirth postCode role"
  );
  res.status(StatusCodes.OK).json({ users, count: users.length });
};

// Get Single User
const getSingleUser = async (req, res) => {
  const { email } = req.params;
  const user = await User.findOne({ email }).select("-password");

  if (!user) {
    throw new NotFoundError(`User with the email ${email} not found`);
  }

  res.status(StatusCodes.OK).json({ user });
};

// REGISTER
const registerUser = async (req, res) => {
  const { email } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.json({
      msg: "user already existed",
    });
  }

  const password = passwordGenerator(12, false);

  const newData = { ...req.body, password };
  const user = await User.create({ ...newData });

  console.log(`${newData.password}, ${newData.email} `);
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: newData.email,
    from: "odionjulius7@gmail.com",
    subject: "Your new account has been created!",
    // text: `Hello ${newData.firstName}, your new account has been created with the following login details: Email: ${newData.email}, Password: ${newData.password}`,
    html: `<strong>Hello ${newData.firstName}, your new account has been created with the following login details: Email: ${newData.email}, Password: ${newData.password}</strong>`,
  };
  await sgMail.send(msg);
  // const info = await sgMail.send(msg);
  // res.json(info);

  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({ user, token });
};

//
const registerAdmin = async (req, res) => {
  const { email } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.json({
      msg: "user already existed",
    });
  }
  const user = await User.create({ ...req.body });

  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({ user, token });
};

// LOGIN
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please, provide email and password");
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError(`Invalid Credentials  password ${password}`);
  }
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    user: { name: user.name, email: user.email, id: user._id },
    token,
  });
};

// admin login
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please, provide email and password");
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  if (user.role === "user") {
    throw new UnauthenticatedError(
      "Unauthorize credential, This is not an admin account"
    );
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError(`Invalid Credentials  password ${password}`);
  }

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    user: { name: user.name, email: user.email, id: user._id },
    token,
    role: user.role,
  });
};

// edit user details
const editUserDetails = async (req, res) => {
  const { userId } = req.user;
  const email = req.params.email;
  const update = req.body;

  const authUser = await User.findOne({ _id: userId });
  if (authUser.role === "user") {
    throw new UnauthenticatedError(
      "Unauthorize credential, This is not an admin account"
    );
  }
  // Update user by id using Mongoose
  const updatedUser = await User.findOneAndUpdate({ email: email }, update, {
    new: true,
  });

  res
    .status(StatusCodes.OK)
    .json({ message: "user details updated", updatedUser });
};

module.exports = {
  registerUser,
  registerAdmin,
  loginAdmin,
  loginUser,
  getUser,
  getSingleUser,
  editUserDetails,
};

// we can hash the password in our control or we use the mongoose middleware for that in the model
// const register = async (req, res) => {
//   const { name, email, password } = req.body;

//   const salt = await bcrypt.genSalt(10); // the number of rounds of byte of the hashed password should be(10 is a default)

//   const hashedPassword = await bcrypt.hash(password, salt);

//   const tempUser = { name, email, password: hashedPassword };

//   const user = await User.create({ ...tempUser });
//   res.status(StatusCodes.CREATED).json({ user });
// res
// .status(StatusCodes.CREATED)
// .json({ user: { name: user.getName() }, token }); // or use mongoose property getter method frm schema;
// .json({ user: { name: user.name, id: user._id }, token });
// };

// Generate password for users as admin
// const register = async (req, res) => {
//   const { name, email } = req.body;
//   const password = passwordGenerator(12, false);

//   const salt = await bcrypt.genSalt(10); // the number of rounds of byte of the hashed password should be(10 is a default)

//   // const hashedPassword = await bcrypt.hash(password, salt);

//   const tempUser = { name, email, password };
//   // const tempUser = { name, email, password: hashedPassword};

//   const user = await User.create({ ...tempUser });
//   res.status(StatusCodes.CREATED).json({ user });
// };

// const { StatusCodes } = require("http-status-codes");
// const User = require("../models/User");
// const { BadRequestError, UnauthenticatedError } = require("../errors");
// const bcrypt = require("bcrypt");
// // const passwordGenerator = require("password-generator"); // generated fakePassword

// const getUser = (req, res) => {
//   res.send("hi here");
// };

// // REGISTER
// const register = async (req, res) => {
//   const { email } = req.body;
//   const existingUser = await User.findOne({ email });

//   if (existingUser) {
//     return res.json({
//       msg: "user already existed",
//     });
//   }
//   const user = await User.create({ ...req.body });
//   // note: when we create(), mongose genearte a method to get the properties in the model

//   const token = user.createJWT();
//   // the token we created in the model to genrate token when we register and as well the method to get it through d model

//   res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
// };

// // LOGIN
// const login = async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     throw new BadRequestError("Please, provide email and password");
//   }

//   // first find the user with email, to know if it exist 1st
//   const user = await User.findOne({ email });

//   // check if user exist
//   if (!user) {
//     throw new UnauthenticatedError("Invalid Credentials");
//   }

//   const isPasswordCorrect = await user.comparePassword(password); // we wait for it to compare

//   // check if matches that of the user gotten user gotten
//   if (isPasswordCorrect) {
//     throw new UnauthenticatedError(`Invalid Credentials  password ${password}`);
//   }

//   const token = user.createJWT(); // us tha mongoose method to get the token with props

//   res.status(StatusCodes.OK).json({
//     user: { name: user.name, email: user.email, id: user._id },
//     token,
//     status: isPasswordCorrect,
//   });
// };

// module.exports = { register, login, getUser };

// // we can hash the password in our control or we use the mongoose middleware for that in the model
// // const register = async (req, res) => {
// //   const { name, email, password } = req.body;

// //   const salt = await bcrypt.genSalt(10); // the number of rounds of byte of the hashed password should be(10 is a default)

// //   const hashedPassword = await bcrypt.hash(password, salt);

// //   const tempUser = { name, email, password: hashedPassword };

// //   const user = await User.create({ ...tempUser });
// //   res.status(StatusCodes.CREATED).json({ user });
// // res
// // .status(StatusCodes.CREATED)
// // .json({ user: { name: user.getName() }, token }); // or use mongoose property getter method frm schema;
// // .json({ user: { name: user.name, id: user._id }, token });
// // };

// // Generate password for users as admin
// // const register = async (req, res) => {
// //   const { name, email } = req.body;
// //   const password = passwordGenerator(12, false);

// //   const salt = await bcrypt.genSalt(10); // the number of rounds of byte of the hashed password should be(10 is a default)

// //   // const hashedPassword = await bcrypt.hash(password, salt);

// //   const tempUser = { name, email, password };
// //   // const tempUser = { name, email, password: hashedPassword};

// //   const user = await User.create({ ...tempUser });
// //   res.status(StatusCodes.CREATED).json({ user });
// // };
