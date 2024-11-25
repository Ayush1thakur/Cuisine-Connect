// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const User = require('../models/User');
const handleToken = require('../middlewares/validToken');
const { CreateError } = require('../middlewares/ErrorHandling');

router.get('/cart', handleToken, async (req, res, next) => {
    const user = req.user; // User info from token

    try {
        // Find the cart for the user
        const cart = await Cart.findOne({ user: user.userId });

        // If the cart doesn't exist, pass an empty array for items and totalPrice as 0
        if (!cart) {
            return res.render('cart', { cart: [], totalPrice: 0 });
        }

        // Ensure that cart.items is an array even if it's empty
        res.render('cart', { cart: cart.items || [], totalPrice: cart.totalPrice || 0 });
    } catch (err) {
        next(err);
    }
});


// POST /cart: Add an item to the user's cart
router.post('/cart', handleToken, async (req, res, next) => {
    const { foodName, price, quantity } = req.body; // Get foodName, price, and quantity from the form
    const user = req.user; // User info from token

    try {
        // Ensure quantity is an integer and defaults to 1 if not provided
        const itemQuantity = parseInt(quantity) || 1;

        // Find the user's cart
        let cart = await Cart.findOne({ user: user.userId });

        if (!cart) {
            // If no cart exists, create a new one
            cart = new Cart({ user: user.userId, items: [] });
        }

        // Check if the item already exists in the cart
        const existingItem = cart.items.find(item => item.foodName === foodName);

        if (existingItem) {
            // If the item exists, update the quantity
            existingItem.quantity += itemQuantity;
        } else {
            // Otherwise, add a new item with the quantity
            cart.items.push({ foodName, price, quantity: itemQuantity });
        }

        // Recalculate the total price
        cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

        // Save the updated cart
        await cart.save();

        // Redirect back to the cart page
        res.redirect('/cart');
    } catch (err) {
        next(err);
    }
});


// POST /cart/remove: Remove an item from the user's cart
router.post('/cart/remove', handleToken, async (req, res, next) => {
    const { foodName } = req.body;
    const user = req.user; // User info from token

    try {
        const cart = await Cart.findOne({ user: user.userId });

        if (!cart) {
            return next(CreateError(404, 'Cart not found.'));
        }

        // Remove the item from the cart
        cart.items = cart.items.filter(item => item.foodName !== foodName);

        // Recalculate the total price
        cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

        // Save the updated cart
        await cart.save();

        // Redirect back to the cart page
        res.redirect('/cart');
    } catch (err) {
        next(err);
    }
});

// Increment item quantity
router.post('/cart/increment', handleToken, async (req, res, next) => {
    const { foodName } = req.body;
    const user = req.user;

    try {
        const cart = await Cart.findOne({ user: user.userId });
        
        if (!cart) {
            return res.redirect('/cart'); // If no cart exists, just redirect
        }

        // Find the item in the cart
        const item = cart.items.find(item => item.foodName === foodName);

        if (item) {
            item.quantity += 1; // Increment the quantity
        }

        // Recalculate the total price
        cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

        await cart.save();

        res.redirect('/cart'); // Redirect back to cart
    } catch (err) {
        next(err);
    }
});

// Decrement item quantity
router.post('/cart/decrement', handleToken, async (req, res, next) => {
    const { foodName } = req.body;
    const user = req.user;

    try {
        const cart = await Cart.findOne({ user: user.userId });
        
        if (!cart) {
            return res.redirect('/cart'); // If no cart exists, just redirect
        }

        // Find the item in the cart
        const itemIndex = cart.items.findIndex(item => item.foodName === foodName);

        if (itemIndex !== -1) {
            const item = cart.items[itemIndex];

            // If quantity is greater than 1, decrement it
            if (item.quantity > 1) {
                item.quantity -= 1; // Decrement the quantity
            } else {
                // If quantity is 1, remove the item from the cart
                cart.items.splice(itemIndex, 1); // Remove the item from the cart
            }
        }

        // Recalculate the total price
        cart.totalPrice = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

        await cart.save();

        res.redirect('/cart'); // Redirect back to cart
    } catch (err) {
        next(err);
    }
});



// // routes/cartRoutes.js
// router.post('/cart/update', handleToken, async (req, res, next) => {
//     const { foodName, action } = req.body;
//     const user = req.user; // User info from token

//     try {
//         let cart = await Cart.findOne({ user: user.userId });

//         if (!cart) {
//             return next(CreateError(404, 'Cart not found.'));
//         }

//         const item = cart.items.find(item => item.foodName === foodName);
//         if (!item) {
//             return next(CreateError(404, 'Item not found in cart.'));
//         }

//         // Increment or decrement the quantity
//         if (action === 'increment') {
//             item.quantity += 1;
//         } else if (action === 'decrement' && item.quantity > 1) {
//             item.quantity -= 1;
//         }

//         // Recalculate the total price
//         cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

//         // Save the updated cart
//         await cart.save();

//         res.redirect('/cart');
//     } catch (err) {
//         next(err);
//     }
// });


module.exports = router;
