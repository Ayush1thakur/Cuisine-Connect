const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const fooddatabase=require("./food.json");
const multer = require("multer");
const { v4: uuidv4 } = require('uuid');
const uuid=uuidv4();
const methodOverride = require('method-override');
const routersignup=require("./routes/signUp");
const routerlogin=require("./routes/login")

app.use(express.static('public'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());

// Use method override. 
app.use(methodOverride('_method'));

app.use('/',routersignup);
app.use('/',routerlogin);
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
const singleUpload = multer({ storage }).single("image");

app.get('/login',(req,res)=>{
   res.render('login');
})

app.get('/signup',(req,res)=>{
   res.render('signup');
})


let HeaderContent=["Home","Menu","About","Contact"];
app.get('/', (req, res) => {
   res.render('food', { foods: fooddatabase, header:HeaderContent});
});

app.get('/Home', (req, res) => {
   res.render('food', { foods: fooddatabase, header:HeaderContent});
});

app.get('/Menu', (req, res) => {
   res.render('menu', { foods: fooddatabase, header:HeaderContent});
});


app.get("/admin", (req, res) => {
   res.render('AddFood',{ foods: fooddatabase, });
});

// get menu
app.post("/admin", singleUpload, (req, res, next) => {

   if (!req.file) {
      return res.status(400).send({ message: "No file uploaded" });
   }

   let domainName = "http://localhost:1000/FoodImage/";
   let file = req.file; 
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
         id: uuid,
         name,
         price,
         image: file.filename 
      };

      database.push(newFood);

      fs.writeFile("./food.json", JSON.stringify(database), (err) => {
         if (err) {
            return next(err);
         }
         res.redirect('/admin?success=true');
      });
   }
});


app.delete("/admin/:id", (req, res, next) => {
   console.log("Delete route hit!");
   console.log(req.method);

   let database = fooddatabase;
   let foodId = req.params.id; 

   let index = database.findIndex((item) => item.id === foodId);

   if (index == -1) {
       return res.status(404).send({ message: "Food item not found" });
   } 
   else {
      let removedItem = database.splice(index, 1);
      fs.writeFile("./food.json", JSON.stringify(database), (err) => {
         if (err) {
            return next(err);
         }
         res.redirect('/admin?delsuccess=true');
      });
   }

});

app.put("/admin/:id", (req, res, next) => {
   let database = fooddatabase;
   let foodId = req.params.id; 
   let { name, price, image } = req.body;

   let index = database.findIndex((item) => item.id === foodId);

   if (index == -1) {
       return res.status(404).send({ message: "Food item not found" });
   } else {
       database[index] = {
           id: foodId, 
           name: name || database[index].name, 
           price: price || database[index].price,
           image: image || database[index].image
       };

       fs.writeFile("./food.json", JSON.stringify(database), (err) => {
           if (err) {
               return next(err);
           }
           res.status(200).send({ message: "Food item updated", item: database[index] });
       });
   }
});

app.patch("/admin/:id", (req, res, next) => {
   let database = fooddatabase;
   let foodId = req.params.id;  // Use UUID (string) instead of parseInt
   let { name, price, image } = req.body;

   let index = database.findIndex((item) => item.id === foodId);

   if (index === -1) {
       return res.status(404).send({ message: "Food item not found" });
   } else {
       // Only update the fields that are provided in the request body
       if (name) database[index].name = name;
       if (price) database[index].price = price;
       if (image) database[index].image = image;

       fs.writeFile("./food.json", JSON.stringify(database), (err) => {
           if (err) {
               return next(err);
           }
           res.status(200).send({ message: "Food item updated", item: database[index] });
       });
   }
});

 
const PORT = 1000;
app.listen(PORT, (err) => {
   if(err){
      console.log(err);
   }
   else{
      console.log(`Server running at:- http://localhost:${PORT}`);
   }
});
