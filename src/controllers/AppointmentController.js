const AppointmentModel = require("../models/AppointmentModel");
const sharp = require("sharp");
const dayjs = require("dayjs");
const BarberModel = require("../models/BarberModel");

const createAppointment = async (req, res) => {
  try {
    // const appointmentData = {
    //   ...req.body,
    //   base64ImageUrl: processedBase64Image,
    // };

    const appointment = await AppointmentModel.create(req.body);
    res.status(200).json(appointment);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while creating the appointment." });
  }
};

const calculateAndUpdateBarberRatings = async (req, res) => {
  try {
    const barberRatings = await AppointmentModel.aggregate([
      {
        $group: {
          _id: "$barberName",
          averageRating: { $avg: "$barberRating" },
        },
      },
    ]);

    return res.status(200).json(barberRatings);
  } catch (error) {
    console.error("Error updating barber rating:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while updating barber rating" });
  }
};

// async function processBase64Image(base64Image) {
//   const inputBuffer = Buffer.from(base64Image, "base64");

//   sharp(inputBuffer)
//     .metadata()
//     .then((metadata) => {
//       const actualWidth = metadata.width;
//       const actualHeight = metadata.height;

//       const targetWidth = 800;
//       const targetHeight = Math.floor(
//         (actualHeight / actualWidth) * targetWidth
//       );

//       sharp(inputBuffer)
//         .resize(targetWidth, targetHeight)
//         .extract({
//           left: 0,
//           top: 0,
//           width: targetWidth,
//           height: targetHeight,
//         })
//         .toBuffer()
//         .then((croppedAndResizedBuffer) => {
//           const croppedAndResizedBase64 =
//             croppedAndResizedBuffer.toString("base64");

//           return croppedAndResizedBase64;
//         })
//         .catch((err) => {
//           console.error("Error resizing and cropping image:", err);
//         });
//     })
//     .catch((err) => {
//       console.error("Error getting image metadata:", err);
//     });
// }

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

const deleteAppointmentById = async (req, res, next) => {
  try {
    const appointment = await AppointmentModel.findOneAndDelete({
      _id: req.params._id,
    });
    res.status(200).json(appointment);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createAppointment,
  getAppointmentById,
  getAppointmentList,
  getAppointmentByEmail,
  getMonthlyAppointmentCounts,
  updateRatingById,
  deleteAppointmentById,
  calculateAndUpdateBarberRatings,
};
