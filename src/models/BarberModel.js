const mongoose = require("mongoose");

const BarberSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
    },
    status: {
      type: String,
      default: "available",
    },
    rating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("barbers", BarberSchema);
