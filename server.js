const express = require('express');
const cors = require("cors");
const dotenv = require('dotenv');
const passport = require("passport");
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const googleAuthRoute = require('./routes/googleAuth');
const router = require('./routes/transaction')
const path = require("path");

dotenv.config();
const app = express();
connectDB();
const PORT = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);


app.use(express.json()); 

app.use(passport.initialize());
app.use("/api", authRoutes);
app.use("/auth", googleAuthRoute);

app.use("/api", router);

app.use(express.static(path.join(__dirname, "public")));


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`);
})