const BarberModel = require("../models/BarberModel");

const createBarber = async (req, res) => {
  try {
    const barber = await BarberModel.create(req.body);
    res.status(200).json(barber);
  } catch (err) {
    console.log(err);
  }
};

const getBarberById = async (req, res) => {
  try {
    const barber = await BarberModel.findById(req.params._id);
    res.status(200).json(barber);
  } catch (err) {
    console.log(err);
  }
};

const getBarberList = async (req, res, next) => {
  try {
    const barber = await BarberModel.find();
    res.status(200).json(barber);
  } catch (err) {
    next(err);
  }
};

const deleteByBarberId = async (req, res, next) => {
  try {
    const barber = await BarberModel.findOneAndDelete({ _id: req.params._id });
    res.status(200).json(barber);
  } catch (err) {
    next(err);
  }
};

const getByBarberName = async (req, res, next) => {
  const fullname = req.params.fullname.trim();
  console.log(req.params);
  try {
    const barber = await BarberModel.findOne({ fullname: fullname });
    console.log(barber);
    res.status(200).json(barber);
  } catch (err) {
    next(err);
  }
};

const updateBarberStatusById = async (req, res) => {
  try {
    const barber = await BarberModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(barber);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createBarber,
  getBarberById,
  getBarberList,
  deleteByBarberId,
  getByBarberName,
  updateBarberStatusById,
};
