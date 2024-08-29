const express = require ("express");
const app = express();
app.use(express.json());

const path = require("path");
const PORT = 1000;



app.listen (PORT, (err)=> {
    if (err){
        console.log(err);
    }
    else{
        console.log(`Server started at ${PORT}`);
    }
})
