const UserModel = require("../models/UserModel");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  try {
    const { fullname, contactNumber, email, role, password } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      fullname,
      contactNumber,
      email,
      role,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully", newUser });
  } catch (err) {
    console.log(err);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({ message: "User logged in successfully", user });
  } catch (err) {
    console.log(err);
  }
};

const getSpecificUserByEmail = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.params.email });
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
};

const getUserList = async (req, res) => {
  try {
    const userList = await UserModel.find();
    res.status(200).json(userList);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getSpecificUserByEmail,
  getUserList,
};
