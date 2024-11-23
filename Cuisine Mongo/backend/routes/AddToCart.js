const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');  // Cart model
const Product = require('../models/Product');  // Product model
const isAuthenticated = require('../middlewares/Authentication');  // Authentication middleware
const { CreateError } = require('../middlewares/ErrorHandling');  // Use custom error handling

// Add to cart
router.post('/cart/add', isAuthenticated, async (req, res, next) => {
    const userId = req.session.user.id;  // Ensure the session is accessible
    const { productId } = req.body;

    if (!productId) {
        return next(CreateError(400, 'Product ID is required!'));  // Return specific error for missing product ID
    }

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return next(CreateError(404, 'Product not found!'));  // Return specific error for product not found
        }

        // Check if the product is already in the cart
        let cartItem = await Cart.findOne({ user: userId, product: productId });
        if (cartItem) {
            // If product is already in cart, just increase the quantity
            cartItem.quantity += 1;
            await cartItem.save();
        } else {
            // Otherwise, add the product to the cart
            cartItem = new Cart({ user: userId, product: productId, quantity: 1 });
            await cartItem.save();
        }

        res.redirect('/menu');
    } catch (error) {
        next(error);  // Pass error to error handler middleware
    }
});

// View Cart
// View Cart
router.get('/cart', isAuthenticated, async (req, res, next) => {
    const userId = req.session.user.id;  // Get the user ID from the session

    try {
        const cartItems = await Cart.find({ user: userId }).populate('product');

        // Define the 'header' data to pass to the view
        const header = ['Home', 'Menu', 'About', 'Cart']; // Or dynamic data based on your needs

        // Pass user and cartItems to the view
        if (cartItems.length === 0) {
            return res.render('cart', { message: 'Your cart is empty!', header, user: req.session.user });  // Pass user along with other data
        }

        res.render('cart', { cartItems, header, user: req.session.user });  // Pass user to the view
    } catch (error) {
        next(error);
    }
});


// Remove from cart
router.post('/cart/remove', isAuthenticated, async (req, res, next) => {
    const userId = req.session.user.id;
    const { cartItemId } = req.body;

    if (!cartItemId) {
        return next(CreateError(400, 'Cart item ID is required!'));  // Ensure cart item ID is provided
    }

    try {
        // Find the cart item by ID and ensure it belongs to the user
        const cartItem = await Cart.findById(cartItemId);
        if (!cartItem) {
            return next(CreateError(404, 'Cart item not found!'));  // Handle case where cart item does not exist
        }

        if (cartItem.user.toString() !== userId.toString()) {
            return next(CreateError(403, 'You are not authorized to remove this item!'));  // Ensure the item belongs to the logged-in user
        }

        await Cart.findByIdAndDelete(cartItemId);  // Delete the item from the cart
        res.redirect('/cart');  // Redirect to the cart page after removal
    } catch (error) {
        next(error);  // Pass error to error handler middleware
    }
});

module.exports = router;  // Export the router for use in your app
