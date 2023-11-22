const EmailController = require("../controllers/EmailController");
const router = require("express").Router();

router.post("/sentOtp", EmailController.sendOtp);

router.post("/verify-otp", EmailController.verifyOtp);

router.post("/send", EmailController.sendVerificationEmail); //send verification email

router.get("/enable", EmailController.enableEmail); // enable registration email

module.exports = router;
