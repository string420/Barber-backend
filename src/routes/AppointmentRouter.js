const router = require("express").Router();

const AppointmentController = require("../controllers/AppointmentController");

router.post("/create", AppointmentController.createAppointment);

router.get("/:id", AppointmentController.getAppointmentById);

router.get("/", AppointmentController.getAppointmentList);

router.get("/list/:email", AppointmentController.getAppointmentByEmail);

router.get("/monthly/data", AppointmentController.getMonthlyAppointmentCounts);

router.put("/update/:id", AppointmentController.updateRatingById);

router.delete("/delete/:id", AppointmentController.deleteAppointmentById);

router.get(
  "/calculate/ratings",
  AppointmentController.calculateAndUpdateBarberRatings
);

module.exports = router;
