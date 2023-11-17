const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
    },

    contactNumber: {
      type: String,
    },
    email: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
    },
    password: {
      type: String,
    },
    isEnable: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("users", UserSchema);
