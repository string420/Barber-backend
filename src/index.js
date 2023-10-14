const express = require("express");
const mongoose = require("mongoose");
const dotEnv = require("dotenv");
const cors = require("cors");
const expressSession = require("express-session");

dotEnv.config();

const UserRouter = require("./routes/UserRouter");
const AppointmentRouter = require("./routes/AppointmentRouter");
const BarberRouter = require("./routes/BarberRouter");
const CutRouter = require("./routes/CutRouter");

const app = express();
app.use(express.json());

// const allowedOrigins = ["https://mangubat-barbershop.vercel.app"];

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
// };

app.use(cors());

app.use(
  expressSession({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

//mongoose connection here
mongoose.set("strictQuery", false);
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB);
    console.log("connected to mongoDb");
  } catch (error) {
    throw error;
  }
};

app.use("/api/user", UserRouter);
app.use("/api/appointment", AppointmentRouter);
app.use("/api/barber", BarberRouter);
app.use("/api/cut", CutRouter);

const PORT = 5000;
app.listen(PORT, () => {
  connect();
  console.log(`server is listening to port ${PORT}`);
});
