const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');

dotenv.config();
const app = express();
connectDB();
const PORT = process.env.PORT;


app.use(express.json()); 

app.use("/api", authRoutes);


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`);
})