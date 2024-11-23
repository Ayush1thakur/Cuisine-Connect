const express = require('express');
const router = express.Router();
const Product = require('../models/Product');  
const { CreateError } = require('../middlewares/ErrorHandling');  

const HeaderContent = ["Home", "Menu", "About", "Contact"];

router.get('/', async (req, res, next) => {
    const user = req.session.user;  // Get user info from session
    try {
        const products = await Product.find();  // Get all products from the database
        if (!products) {
            return next(CreateError(404, 'No products found.'));
        }
        res.render('food', { foods: products, header: HeaderContent, user });
    } catch (err) {
        next(err);  // Pass any error to the error handling middleware
    }
});

// Route for the Home page
router.get('/Home', async (req, res, next) => {
    const user = req.session.user;  
    try {
        const products = await Product.find();  
        if (!products) {
            return next(CreateError(404, 'No products found.'));
        }
        res.render('food', { foods: products, header: HeaderContent, user });
    } catch (err) {
        next(err);  
    }
});

// Route for the Menu page
router.get('/Menu', async (req, res, next) => {
    const user = req.session.user;
    try {
        const products = await Product.find(); 
        if (!products) {
            return next(CreateError(404, 'No products found.'));
        }
        res.render('menu', { foods: products, header: HeaderContent, user });
    } catch (err) {
        next(err);  
    }
});

// Route for the Contact page
router.get('/contact', (req, res) => {
    const user = req.session.user;
    res.render('contact', { header: HeaderContent, user });
});

// Route for the About page
router.get('/about', (req, res) => {
    const user = req.session.user;
    res.render('about', { header: HeaderContent, user });
});

// Route to handle checkout
router.post('/checkout', (req, res) => {
    const cart = req.session.cart || [];
    if (cart.length === 0) {
        return res.redirect('/menu');
    }

    // Process the checkout (this is a placeholder, you could integrate with payment systems)
    req.session.cart = [];  // Clear the cart after checkout
    res.render('checkout', { header: HeaderContent, message: 'Checkout successful!' });
});



module.exports = router;
