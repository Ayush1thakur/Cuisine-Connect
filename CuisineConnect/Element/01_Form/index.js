const express = require("express");
const index = express();

const db = require ('./db')

const PORT = 9000;

index.use(express.json());



index.listen (PORT, (err) =>{
    if (err){
        console.log(err);
    }
    else{
        console.log(`Server started at ${PORT}`);
    }
})
