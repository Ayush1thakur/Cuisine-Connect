const express = require('express');
const router = express.Router();
const Product = require('../models/Product');  
const { singleUpload } = require('../middlewares/FileUpload');  
const { v4: uuidv4 } = require('uuid');
const methodOverride = require('method-override');

router.use(methodOverride('_method'));

router.get("/admin", async (req, res, next) => {
   const user = req.session.user;  
   try {
       const products = await Product.find();  
       res.render('AddFood', { foods: products, user });
   } catch (err) {
       next(err);
   }
});

router.post("/admin", singleUpload, async (req, res, next) => {
   if (!req.file) {
      return res.status(400).send({ message: "No file uploaded" });
   }

   const { name, price } = req.body;
   const image = req.file.filename; 
   if (!name || !price) {
      return res.status(400).send({ message: "Name and price are required" });
   }

   try {
       const existingProduct = await Product.findOne({ name: name.toLowerCase() });

       if (existingProduct) {
           return res.status(409).send({ message: "Food item already exists" });
       }

       const newProduct = new Product({
           id: uuidv4(),  
           name,
           price,
           image,  
       });

       await newProduct.save();

       res.status(201).send(`
        <script>
            alert('Food Item  is added successfully');
            window.location.href = "/admin"; // Redirect to admin page
        </script>
    `);
   } catch (err) {
       next(err);  
   }
});

router.delete("/admin/:id", async (req, res, next) => {
   const productId = req.params.id;

   try {
       const product = await Product.findOneAndDelete({ id: productId });

       res.status(201).send(`
        <script>
            alert('Food Item is deleted successfully');
            window.location.href = "/admin"; // Redirect to admin page
        </script>
    `);

   } catch (err) {
       next(err);
   }
});


router.put('/admin/:id', singleUpload, async (req, res, next) => {
    const productId = req.params.id;
    const { name, price } = req.body;

    try {
        const product = await Product.findOne({ id: productId });

        // Update product details
        product.name = name || product.name;
        product.price = price || product.price;

        // Update image path
        if (req.file) {
            product.image = `${req.file.filename}`;
        }

        await product.save();
        console.log('Uploaded file:', req.file);


        res.status(201).send(`
            <script>
                alert('Food Item updated successfully');
                window.location.href = "/admin";
            </script>
        `);
    } catch (err) {
        next(err);
    }
});


module.exports = router;
