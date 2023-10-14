const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
    },
    appointmentDate: {
      type: String,
      required: true,
    },
    appointmentTime: {
      type: String,
      required: true,
    },
    barberName: {
      type: String,
    },
    cutStyle: {
      type: String,
    },
    barberRating: {
      type: Number,
      default: 0,
    },
    base64ImageUrl: {
      type: String,
    },
    reason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("appointments", AppointmentSchema);
