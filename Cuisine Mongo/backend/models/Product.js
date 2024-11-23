const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');  

const productSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,  
    unique: false,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
