const nodemailer = require("nodemailer");
const router = require("express").Router();

router.post("/send", async (req, res) => {
  let { recipient } = req.body;

  const enableLink = `https://barber-backend-production-6f4b.up.railway.app/api/email/enable?email=${recipient}`;

  // const enableLink = `http://localhost:5000/api/email/enable?email=${recipient}`;

  try {
    const transport = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      service: "Gmail",
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_FROM,
      to: recipient,
      subject: "Email Verification",
      html: `<div className="email" style="
        border: 1px solid  black; 
        padding: 20px; 
        font-family: sans-serif; 
        line-height: 2;
        font-size: 20px;">
        
        <h2>Hi, </h2> \n
        <p>Click the link below to enable your account:</p>
        <a href="${enableLink}">${enableLink}</a>
  
        <p>Regards, \n Mangubat BarberShop</p>
        </div>`,
    };

    await transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error:", error);
      } else {
        console.log("Email sent: " + info.response);
        res.status(201).json({ status: 201, info });
      }
    });
  } catch (error) {
    res.status(201).json({ status: 401, error });
  }
});

router.get("/enable", async (req, res) => {
  const { email } = req.query;

  try {
    await User.findOneAndUpdate({ email }, { isEnable: true });

    res.status(200).json({ status: 200, message: "User account enabled" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: 500, error: "Failed to enable the user's account" });
  }
});

module.exports = router;
