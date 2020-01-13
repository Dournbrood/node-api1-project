//IMPOOOOOORTS!
const express = require("express");

const Database = require("./data/db");

const server = express();

server.use(express.json());
// Routes go here

// POST to "/api/users"
server.post("/api/users", (request, response) => {
    const userData = request.body;
    if (userData.name && userData.bio) {
        Database.insert(userData)
            .then((userID) => {
                response.status(201).json({ ...userData, ...userID });
                console.log("RESPONSE IS: ", response);

            }).catch((error) => {
                response.status(500).json({
                    errorText: "Internal server write error on User POST request.",
                    errorMessage: error,

                })
                console.log("ERROR IS: ", error);
            });
    }
    else {
        response.send("User not created. Please supply the user's name and bio.");
    }
})

//GET to /api.users

server.get("/api/users", (request, response) => {
    if (request.params.id !== undefined) {
        Database.find()
            .then((users) => {
                response.status(200).json(users);
            })
            .catch((error) => {
                response.status(500).json({
                    errorText: "Internal server read error on Users GET request.",
                    errorMessage: error,
                })
                console.log("ERROR IS: ", error);
            });
    }
});

//localhost:8001/api/users/6

//GET to /api/users/:id
server.get("/api/users/:id", (request, response) => {
    const id = request.params.id;
    Database.findById(id)
        .then((user) => {
            if (user) {
                response.status(200).json({ ...user, id: id });
                console.log("USER IS: ", user);
            }
            else {
                response.status(404).json({
                    errorMessage: "The user with the specified ID does not exist..."
                })
            }
        })
        .catch((error) => {
            response.status(500).json({
                errorText: "Internal server read error on User GET request.",
                errorMessage: error,
            })
            console.log("ERROR IS: ", error);
        });


});

//DELETE to /api/users/:id
server.delete("/api/users/:id", (request, response) => {
    const id = request.params.id;
    Database.remove(id)
        .then((deleted) => {
            if (deleted) {
                response.status(200).json(deleted);
            }
            else {
                response.status(404).json({
                    errorMessage: "The user with the specified ID does not exist..."
                })
            }
        })
        .catch((error) => {
            response.status(500).json({
                errorText: "Internal server read error on User DELETE request.",
                errorMessage: error,
            })
            console.log("ERROR IS: ", error);
        });


});

//PUT to /api/users/:id
server.put("/api/users/:id", (request, response) => {
    const id = request.params.id;
    if (request.body.name && request.body.bio) {
        Database.update(id, request.body)
            .then((recordsUpdated) => {
                if (recordsUpdated) {
                    response.status(200).json({ ...request.body });
                }
                else {
                    response.status(404).json({ errorMessage: "The user with the specified ID does not exist." });
                }
            })
            .catch((error) => {
                response.status(500).json({
                    errorText: "Internal server read error on User PUT request.",
                    errorMessage: error,
                })
                console.log("ERROR IS: ", error);
            });
    }
    else {
        response.send("User not updated. Please supply the user's name and bio.");
    }
});
//Define port
const port = 8001;
server.listen(port, () => {
    console.log(`API listening on port ${port}.`);
})