const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
router.get('/food-item-analysis', async (req, res) => {
    try {
        const foodRatings = await Order.aggregate([
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.foodName",
                    avgRating: { $avg: "$review.rating" },
                    totalOrders: { $sum: 1 }
                }
            },
            {
                $project: {
                    foodName: "$_id",
                    avgRating: { $ifNull: ["$avgRating", 0] },
                    totalOrders: 1,
                    _id: 0
                }
            }
        ]);
        
        // Check if the data is being passed correctly
        res.render('foodAnalysis', { foodRatings });
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});


module.exports = router;
