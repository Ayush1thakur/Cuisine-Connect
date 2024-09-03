const { CreateError } = require("./ErrorHandling");

const authentocateuser = (req, res, next) => {
    let user = req.user; // Set by userpresent.js middleware
    let password = req.body.password;
    let email = req.body.email;
    let AdminPassword = "adminhere";
    let AdminEmail = "admin@cuisine.org";

    if (password === AdminPassword && email === AdminEmail) {
        req.session.user = { email: AdminEmail, isAdmin: true }; // Store admin info in session
        return res.redirect('/admin');
    }

    if (user && password === user.password && email === user.email) {
        req.session.user = user; // Store user info in session
        return next();
    }

    return next(CreateError(401, "Unauthorized user")); 
};

module.exports = authentocateuser;
