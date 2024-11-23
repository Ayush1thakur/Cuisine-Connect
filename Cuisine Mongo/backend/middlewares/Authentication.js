const { CreateError } = require("./ErrorHandling");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const authenticateuser = async (req, res, next) => {
    const { email, password } = req.body;

    if (req.session.user) {
        return next(); // If already logged in, skip the login process
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return next(CreateError(401, "User not found"));
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return next(CreateError(401, "Invalid credentials"));
        }

        // Store user data in the session for future requests
        req.session.user = { id: user._id, name: user.name, email: user.email };

        console.log("Session after login:", req.session.user); // For debugging

        return next(); // Continue to the next middleware (or route handler)
    } catch (error) {
        return next(CreateError(500, "Internal Server Error"));
    }
};

module.exports = authenticateuser;
