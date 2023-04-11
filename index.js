const express = require("express");
const multer = require('multer');
const app = express();

const kindnessRoutes = require("./routes/kindness");
const usersRoutes = require("./routes/profile");
const cors = require("cors");
require('dotenv').config();
const PORT = process.env.DEV_PORT;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage }).single('file');

//middleware
app.use(express.json());
app.use(cors());
app.use('/kindness', kindnessRoutes);
app.use('/profile', usersRoutes);
app.use(express.static("public"));
app.use("/images", express.static("./public/images"));
app.post('/profile/settings', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.sendStatus(500);
        }
        res.send(req.file);
    })
})

app.listen(PORT, () => {
    console.log("server is running at port" + PORT)
});