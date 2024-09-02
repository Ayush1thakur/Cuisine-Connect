const { CreateError } = require("./ErrorHandling"); // Corrected import
const data = require("../data.json");
const { v4: uuidv4 } = require('uuid'); // Import uuid function

const validatecred = (req, res, next) => {
    let { name, email, password } = req.body;
    let database = data;

    if (!name || !email || !password) {
        return next(CreateError(417, "Expected credentials i.e. email, name, or password not given"));
    }

    let index = database.findIndex(elm => elm.email.toLowerCase() === email.toLowerCase());

    if (index >= 0) {
        return next(CreateError(406, "User already present"));
    } 

    let datatobestored = {
        id: uuidv4(), // Use uuidv4 to generate a unique ID
        name,
        email,
        password
    };
    
    req.newuser = datatobestored; 
    next(); // Proceed to the next middleware
};

module.exports = validatecred;
