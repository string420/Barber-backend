const router = require("express").Router();

const CutController = require("../controllers/CutController");

router.post("/create", CutController.createCut);

router.get("/:id", CutController.getCutById);

router.get("/", CutController.getCutList);

router.put("/update/:id", CutController.updateCutById);

router.delete("/delete/:id", CutController.deleteCutById);

module.exports = router;
