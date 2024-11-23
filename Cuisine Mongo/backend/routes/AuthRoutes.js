const express = require('express');
const router = express.Router();
const authenticateuser = require('../middlewares/Authentication'); 
const userpresent = require("../middlewares/UserPresent"); // Middleware to check if user already exists (e.g., if logged in)

router.get('/login', (req, res) => {
    // Render login page
    res.render('login');
});

router.get('/logout', (req, res) => {
    // Destroy the session when the user logs out
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Unable to log out.");
        }
        res.redirect('/'); // Redirect to home page after logging out
    });
});

router.post('/login', userpresent, authenticateuser, (req, res) => {
    // Redirect to homepage after successful login
    res.redirect("/"); 
});

module.exports = router;
