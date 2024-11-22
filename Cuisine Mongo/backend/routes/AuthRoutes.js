const express = require('express');
const router = express.Router();
const authenticateuser = require('../middlewares/Authentication'); 
const userpresent = require("../middlewares/UserPresent");

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Unable to log out.");
        }
        res.redirect('/');
    });
});

router.post('/login', userpresent, authenticateuser, (req, res, next) => {
    res.redirect("/"); 
});

module.exports = router;
