const express = require("express");
const usersRouter = express.Router();
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

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
            id: user.id
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
        currentActs: [
            {
                id: uuidv4()
            },
        ],
    }
    users.push(newUser);
    writeUsers(users);

    res.status(201).send();
})

usersRouter.post('/login', (req, res) => {
    const loginInfo = req.body;
    const users = readUsers();

    const user = users.find((user) => user.name === loginInfo.user);
    if (!user) res.send('nothing')

    res.json(user)
})

usersRouter.post('/journal', (req, res) => {
    const selectedAct = req.body;

    console.log('selectedAct: ', selectedAct)
    const users = readUsers();

    const selectedActJournal = users.find((user) => user.name === selectedAct.user);
    if (!selectedActJournal) res.send('nothing')

    res.json(selectedActJournal)

    console.log('user: ', selectedActJournal)

})



module.exports = usersRouter;