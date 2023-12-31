const AppointmentModel = require("../models/AppointmentModel");
const dayjs = require("dayjs");

const createAppointment = async (req, res) => {
  try {
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
    const searchTerm = req.query.searchTerm;

    if (searchTerm) {
      const barberRatings = await AppointmentModel.aggregate([
        {
          $match: {
            barberName: { $regex: searchTerm, $options: "i" },
          },
        },
        {
          $group: {
            _id: "$barberName",
            averageRating: { $avg: "$barberRating" },
          },
        },
      ]);
      return res.status(200).json(barberRatings);
    } else {
      const barberRatings = await AppointmentModel.aggregate([
        {
          $group: {
            _id: "$barberName",
            averageRating: { $avg: "$barberRating" },
          },
        },
      ]);
      return res.status(200).json(barberRatings);
    }
  } catch (error) {
    console.error("Error updating barber rating:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while updating barber rating" });
  }
};

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
    const searchTerm = req.query.searchTerm;

    if (searchTerm) {
      const appointments = await AppointmentModel.find({
        barberName: { $regex: searchTerm, $options: "i" },
        appointmentDate: { $gte: dayjs().format("YYYY-MM-DD") },
      }).sort({
        appointmentDate: -1,
      });
      res.status(200).json(appointments);
    } else {
      const appointments = await AppointmentModel.find({
        appointmentDate: { $gte: dayjs().format("YYYY-MM-DD") },
      }).sort({
        appointmentDate: -1,
      });
      res.status(200).json(appointments);
    }
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
      _id: req.params.id,
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
