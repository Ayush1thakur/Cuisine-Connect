// responsible for creating connection b/w node and mongo

const mongoose = require ("mongoose");
const mongoURL = 'mongodb://localhost:27017/cc';

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;

db.on ('connected', () => {
    console.log('Connectd to MongoDB server');
})

db.on ('error', (err) => {
    console.log('MongoDB server error: ',err);
})

db.on ('disconnected', () => {
    console.log('MongoDB disconnected');
})

module.exports = db;