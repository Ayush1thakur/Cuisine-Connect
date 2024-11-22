const express = require('express');
const User = require('../models/User'); 
const validatecred = require('../middlewares/ValidCredentials'); 
const router = express.Router();

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', validatecred, async (req, res, next) => {
    try {
        // The validated user object from the middleware
        const newUser = req.newuser;
        await newUser.save();
        res.status(201).send(`
            <script>
                alert('User is created successfully');
                window.location.href = "/login"; // Redirect to login page
            </script>
        `);
    } catch (err) {
        next(err); 
    }
});

module.exports = router;
