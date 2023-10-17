const router = require("express").Router();
const BarberController = require("../controllers/BarberController");

router.post("/create", BarberController.createBarber);

router.get("/:id", BarberController.getBarberById);

router.get("/", BarberController.getBarberList);

router.get("/fullname/:fullname", BarberController.getByBarberName);

router.put("/update/:id", BarberController.updateBarberStatusById);

router.delete("/delete/:id", BarberController.deleteByBarberId);

module.exports = router;
