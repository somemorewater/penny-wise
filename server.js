const express = require('express');
const cors = require("cors");
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const path = require("path");

dotenv.config();
const app = express();
connectDB();
const PORT = process.env.PORT;


app.use(express.json()); 

app.use("/api", authRoutes);

app.use(express.static(path.join(__dirname, "public")));


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`);
})