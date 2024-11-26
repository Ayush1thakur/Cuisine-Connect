const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); 
const handleToken = require('../middlewares/validToken');

const HeaderContent = ["Home", "Menu", "About", "Contact"];


router.get('/orders', handleToken, async (req, res, next) => {
    const user = req.user;

    try {
        // Fetch all orders for the user
        const orders = await Order.find({ user: user.userId }).sort({ orderDate: -1 });

        // Render the orders page
        res.render('order', { orders ,header: HeaderContent,user});
    } catch (error) {
        next(error);
    }
});

module.exports = router;
