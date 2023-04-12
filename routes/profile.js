const express = require("express");
const usersRouter = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage })

//function to read users
function readUsers() {
    const usersFile = fs.readFileSync("./data/users.json");
    const usersData = JSON.parse(usersFile);
    return usersData;
}

//get users
usersRouter.get("/", (req, res) => {
    const users = readUsers();
    const usersData = users.map((user) => {
        return {
            name: user.name,
            description: user.description,
            image: user.image,
            id: user.id,
            email: user.email,
            location: user.location,
            rank: user.rank,
            currentActs: user.currentActs,
            completedActs: user.completedActs,
        }
    })
    res.status(200).json(usersData);
});

//get selected user by id
usersRouter.get("/:id", (req, res) => {
    const users = readUsers();
    const user = users.find((user) => user.id === req.params.id);
    res.status(200).json(user);
})

// Function to write users
function writeUsers(data) {
    const stringifiedData = JSON.stringify(data);
    fs.writeFileSync("./data/users.json", stringifiedData);
}

//post user
usersRouter.post("/", (req, res) => {
    const users = readUsers();

    const newUser = {
        id: uuidv4(),
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
        description: req.body.description,
        image: req.body.image,
        rank: req.body.rank,
        location: req.body.location,
        currentActs: [],
    }
    users.push(newUser);
    writeUsers(users);
    res.status(201).send(newUser);
})

usersRouter.post('/login', (req, res) => {
    const loginInfo = req.body;
    console.log(loginInfo);
    const users = readUsers();
    console.log(users);
    const user = users.find((user) => user.name === loginInfo.user);
    if (!user) res.send('nothing')

    res.json(user)
})

usersRouter.post('/profile', (req, res) => {
    const selectedAct = req.body.kindActTitle;
    const users = readUsers();

    const selectedUser = users.find((user) => user.id === req.body.id);
    selectedUser.currentActs.push(selectedAct);

    const userIndex = users.findIndex((user) => user.id === req.body.id);
    users[userIndex] = selectedUser;

    fs.writeFile('./data/users.json', JSON.stringify(users), (err) => {
        console.log(err);
        console.log('wrote user?')

        if (!selectedUser) res.send('nothing')

        res.json(selectedUser.currentActs)
    });
})

usersRouter.post("/settings", upload.single('file'), (req, res) => {
    const users = readUsers();
    const updatedUser = users.findIndex((user) => user.id === req.body.id);

    users[updatedUser].image = `http://localhost:8000/images/${req.file.filename}`;
    console.log(req.file);
    fs.writeFile('./data/users.json', JSON.stringify(users), (err) => {
        console.log(err);
    })
    res.status(200).send("working");
})

usersRouter.patch("/settings/:id", (req, res) => {
    const users = readUsers();
    // const { name, email, location, description, password } = req.body;
    const { name } = req.body;
    const { email } = req.body;
    const { password } = req.body;
    const { location } = req.body;
    const { description } = req.body;
    console.log('re .id id id : ', req.params.id)
    const index = users.findIndex((user) => user.id === req.params.id);
    console.log('index: ', index)
    users[index].name = name;
    users[index].password = password;
    users[index].location = location;
    users[index].email = email;
    users[index].description = description;

    console.log('user: ', users[index])
    writeUsers(users);

    res.send('it was successful')
})

module.exports = usersRouter;