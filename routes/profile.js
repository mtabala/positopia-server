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

usersRouter.post('/login', (req, res) => {
    const loginInfo = req.body;

    console.log('loginINfo: ', loginInfo)
    const users = readUsers();

    const user = users.find((user) => user.name === loginInfo.user);
    if (!user) res.send('nothing')

    res.json(user)

    console.log('user: ', user)

})



module.exports = usersRouter;