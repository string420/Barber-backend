const mongoose = require("mongoose");

const CutSchema = new mongoose.Schema(
  {
    cutName: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("cuts", CutSchema);
