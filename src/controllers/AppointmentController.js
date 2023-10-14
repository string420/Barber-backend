const AppointmentModel = require("../models/AppointmentModel");
const sharp = require("sharp");
const dayjs = require("dayjs");

const createAppointment = async (req, res) => {
  try {
    let processedBase64Image = null;

    if (req.body.base64ImageUrl) {
      processedBase64Image = await processBase64Image(req.body.base64ImageUrl);
    }

    const appointmentData = {
      ...req.body,
      base64ImageUrl: processedBase64Image,
    };

    const appointment = await AppointmentModel.create(appointmentData);
    res.status(200).json(appointment);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while creating the appointment." });
  }
};

async function processBase64Image(base64Image) {
  // Convert the base64 image to a buffer
  const inputBuffer = Buffer.from(base64Image, "base64");

  // Analyze image dimensions
  sharp(inputBuffer)
    .metadata()
    .then((metadata) => {
      // Get the actual content dimensions
      const actualWidth = metadata.width;
      const actualHeight = metadata.height;

      // Define the desired width and height for the resized image
      const targetWidth = 800; // Adjust to your preferred width
      const targetHeight = Math.floor(
        (actualHeight / actualWidth) * targetWidth
      );

      // Resize and crop the image to the desired dimensions
      sharp(inputBuffer)
        .resize(targetWidth, targetHeight)
        .extract({
          left: 0,
          top: 0,
          width: targetWidth,
          height: targetHeight,
        })
        .toBuffer()
        .then((croppedAndResizedBuffer) => {
          // Encode the cropped and resized image back to base64
          const croppedAndResizedBase64 =
            croppedAndResizedBuffer.toString("base64");

          return croppedAndResizedBase64;
          // Use the croppedAndResizedBase64 as needed
        })
        .catch((err) => {
          console.error("Error resizing and cropping image:", err);
        });
    })
    .catch((err) => {
      console.error("Error getting image metadata:", err);
    });
}

const getAppointmentById = async (req, res) => {
  try {
    const appointment = await AppointmentModel.findById(req.params.id);
    res.status(200).json(appointment);
  } catch (err) {
    console.log(err);
  }
};

const getAppointmentList = async (req, res, next) => {
  try {
    const appointments = await AppointmentModel.find({
      appointmentDate: { $gte: dayjs().format("YYYY-MM-DD") },
    }).sort({
      appointmentDate: -1,
    });
    res.status(200).json(appointments);
  } catch (err) {
    next(err);
  }
};

const getMonthlyAppointmentCounts = async (req, res) => {
  try {
    const appointmentCounts = await AppointmentModel.aggregate([
      {
        $group: {
          _id: "$appointmentDate",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json(appointmentCounts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAppointmentByEmail = async (req, res) => {
  try {
    const appointment = await AppointmentModel.find({
      email: req.params.email,
    }).sort({
      appointmentDate: -1,
    });
    res.status(200).json(appointment);
  } catch (err) {
    console.log(err);
  }
};

const updateRatingById = async (req, res) => {
  try {
    const appointment = await AppointmentModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(appointment);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createAppointment,
  getAppointmentById,
  getAppointmentList,
  getAppointmentByEmail,
  getMonthlyAppointmentCounts,
  updateRatingById,
};
