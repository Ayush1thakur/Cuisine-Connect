const express = require('express');
const User = require('../models/User'); 
const validatecred = require('../middlewares/ValidCredentials'); 
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config(); 

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', validatecred, async (req, res, next) => {
    try {
        const newUser = req.newuser;

        await newUser.save();

        // Create a JWT token
        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email }, // Payload
            process.env.JWT_SECRET, // Secret key from environment variables
            { expiresIn: '1h' } // Token expiration time (e.g., 1 hour)
        );

        res.status(201).send(`
            <script>
                alert('User is created successfully');
                localStorage.setItem('token', '${token}'); // Store token in localStorage
                window.location.href = "/login"; // Redirect to login page
            </script>
        `);
    } catch (err) {
        next(err); 
    }
});

module.exports = router;
