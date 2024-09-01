const express = require('express');
const router = express.Router();
const authenticateuser = require('../middlewares/authentication'); 
const userpresent = require("../middlewares/userpresent");

router.post('/login',userpresent, authenticateuser, (req, res, next) => {
    // res.status(200).json({ message: "Login successful", user: req.user });
    res.redirect("/");
});

module.exports = router;