const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const fooddatabase=require("./food.json");
const multer = require("multer");

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Middleware configuration for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/FoodImage/"); // Ensure this folder exists
    },
    filename: (req, file, cb) => {
        const filename = file.originalname.replace(/\s+/g, "-");
        cb(null, filename);
    }
});

app.use(express.static('public'));

const singleUpload = multer({ storage }).single("image");

app.use(express.json());

app.get('/', (req, res) => {
   res.render('food', { foods: fooddatabase });
 });

app.get("/admin", (req, res) => {
    res.sendFile("admin.html", { root: path.join(__dirname, "public/html") });
});

app.post("/admin", singleUpload, (req, res, next) => {
   // Check if file was uploaded
   if (!req.file) {
      return res.status(400).send({ message: "No file uploaded" });
   }

   let domainName = "http://localhost:1000/FoodImage/";
   let file = req.file; // Check if the file is present
   let { name, price } = req.body;

   if (!name || !price) {
      return res.status(400).send({ message: "Name and price are required" });
   }

   let database = fooddatabase;
   let index = database.findIndex((item) => item.name.toLowerCase() === name.toLowerCase());

   if (index >= 0) {
      return res.status(409).send({ message: "Food item already exists" });
   } else {
      let newFood = {
         id: new Date().getTime(),
         name,
         price,
         image: file.filename // Use file.filename for proper path
      };

      database.push(newFood);

      fs.writeFile("./food.json", JSON.stringify(database), (err) => {
         if (err) {
            return next(err);
         }
         res.status(201).send({ name: newFood.name, message: "New food created" });
      });
   }
});

2





 
const PORT = 1000;
app.listen(PORT, (err) => {
   if(err){
      console.log(err);
   }
   else{
      console.log(`Server running at:- http://localhost:${PORT}`);
   }
});
