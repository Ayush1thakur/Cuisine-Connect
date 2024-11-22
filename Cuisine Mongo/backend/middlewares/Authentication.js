const { CreateError } = require("./ErrorHandling");
const User = require("../models/User"); 
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing

const authenticateuser = async (req, res, next) => {
    const { email, password } = req.body;

    // Admin credentials 
    const AdminEmail = "admin@cuisine.org";
    const AdminPassword = "adminhere"; 

    if (email === AdminEmail && password === AdminPassword) {
        req.session.user = { email: AdminEmail, isAdmin: true }; 
        return res.redirect('/admin');
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
        // store user info in session
        req.session.user = { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin };

        return next();

    } catch (error) {
        return next(CreateError(500, "Internal Server Error"));
    }
};

module.exports = authenticateuser;
