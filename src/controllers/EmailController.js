const UserModel = require("../models/UserModel");
const nodemailer = require("nodemailer");
const Email = require("../models/Email");
const randomstring = require("randomstring");

// send verification email
const sendVerificationEmail = async (req, res, next) => {
  let { recipient } = req.body;
  const enableLink = `https://barber-backend-production-6f4b.up.railway.app/api/email/enable?email=${recipient}`;

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
};

// enableEmailVerification
const enableEmail = async (req, res, next) => {
  const { email } = req.query;

  console.log("email query", email);

  try {
    await UserModel.findOneAndUpdate({ email: email }, { isEnable: true });

    res.status(200).json("User account successfully enabled");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: 500, error: "Failed to enable the user's account" });
  }
};

// OTP

const sendOtp = async (req, res) => {
  const otp = randomstring.generate({ length: 4, charset: "numeric" });

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

  const { email } = req.body;

  const mailOptions = {
    from: process.env.MAIL_FROM,
    to: email,
    subject: "OTP Verification Code",
    html: `
        <div style="border: 1px solid black; padding: 20px; font-family: sans-serif; line-height: 2; font-size: 20px;">
          <h2>Hi,</h2>
          <p>Your OTP code from Mangubat Barbershop is here:</p>
          <p style="font-size: 24px; font-weight: bold;">${otp}</p>
          <p>Use this code to verify your identity.</p>
          <p>Regards,</p> 
          <p>Mangubat Barbershop</p>
        </div>
      `,
  };

  try {
    await transport.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.log("Error:", error);
        res.status(500).json({ status: 500, error });
      } else {
        console.log("Email sent: " + info.response);

        // Respond with status 200 after successful email sent
        res.status(200).json({
          status: 200,
          info,
          message: "Email sent. Please check your email.",
        });

        const emailDoc = new Email({
          email: email,
          otp: otp,
        });
        await emailDoc.save();

        setTimeout(() => {
          deleteOldEmails(email);
        }, 2 * 60 * 1000); // 2 minutes
      }
    });
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
};

// Function to delete emails older than 2 minutes
const deleteOldEmails = async (email) => {
  const threeMinutesAgo = new Date();
  threeMinutesAgo.setMinutes(threeMinutesAgo.getMinutes() - 3);

  await Email.deleteMany({
    email: email,
    createdAt: { $lt: threeMinutesAgo },
  });

  console.log("Deleted old emails.");
};

const verifyOtp = async (req, res) => {
  const { email, enteredOTP } = req.body;

  try {
    const emailDoc = await Email.findOne({ email: email, otp: enteredOTP });
    if (emailDoc) {
      // OTP is valid
      res.status(200).json({ status: 200, message: "OTP is valid" });
    } else {
      // OTP is invalid
      res.status(401).json({ status: 401, message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ status: 500, error });
  }
};

module.exports = { sendVerificationEmail, enableEmail, sendOtp, verifyOtp };
