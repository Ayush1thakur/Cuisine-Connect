const data = require("../data.json"); // Load the data
const { CreateError } = require("./ErrorHandling");

const userpresent = (req, res, next) => {
    let email = req.body.email;
    let database = data;
    let user = database.find((elm) => elm.email === email); // Find user by email

    if (user) {
        req.user = user; 
        next();
    } else {
        next(CreateError(404, "User not found"));
    }
};

module.exports = userpresent;
