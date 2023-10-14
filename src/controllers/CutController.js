const CutModel = require("../models/CutModel");

const createCut = async (req, res) => {
  try {
    const cut = await CutModel.create(req.body);
    res.status(200).json(cut);
  } catch (err) {
    console.log(err);
  }
};

const getCutById = async (req, res) => {
  try {
    const cut = await CutModel.findById({ _id: req.params.id });
    res.status(200).json(cut);
  } catch (err) {
    console.log(err);
  }
};

const getCutList = async (req, res, next) => {
  try {
    const cut = await CutModel.find();
    res.status(200).json(cut);
  } catch (err) {
    next(err);
  }
};

const deleteCutById = async (req, res, next) => {
  try {
    const cut = await CutModel.findOneAndDelete({
      _id: req.params._id,
    });
    res.status(200).json(cut);
  } catch (err) {
    next(err);
  }
};

const updateCutById = async (req, res) => {
  try {
    const cut = await CutModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(cut);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createCut,
  getCutById,
  getCutList,
  deleteCutById,
  updateCutById,
};
