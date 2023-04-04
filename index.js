const express = require("express");
const app = express();

const kindnessRoutes = require("./routes/kindness");
const usersRoutes = require("./routes/profile");
const cors = require("cors");
require('dotenv').config();
const PORT = process.env.DEV_PORT;

//middleware
app.use(express.json());
app.use(cors());
app.use('/kindness', kindnessRoutes);
app.use('/profile', usersRoutes);

app.listen(PORT, () => {
    console.log("server is running at port" + PORT)
});