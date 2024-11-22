const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); 
const { v4: uuidv4 } = require('uuid'); 

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,  
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        // Hash the password before saving
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
