require('./config/dotenv');  

const express = require('express');
const connectDB = require('./config/db');
const session = require('express-session');
const app = express();
const path = require('path');
const foodRoutes = require('./routes/MainPageRoutes');
const AuthRoutes = require('./routes/AuthRoutes'); 
const SignUpRoutes = require('./routes/SignUpRoutes');
const adminRoutes = require('./routes/AdminRoutes');
const AddToCart = require('./routes/AddToCart');
const { ErrorHandler, CreateError } = require('./middlewares/ErrorHandling'); 

connectDB(); 

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); 

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'cuisine123', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(AuthRoutes); 
app.use(SignUpRoutes); 
app.use(adminRoutes); 
app.use('/', foodRoutes); 
app.use(AddToCart); 

app.use(ErrorHandler);  

const PORT = process.env.PORT || 5000;

// Test route to check session
app.get('/test-session', (req, res) => {
    console.log(req.session.user); 
    res.send('Check console for session');
});

app.listen(PORT, () => {
    console.log(`Server running on: http://localhost:${PORT}`);
});

// console.log("Session User:", req.session.user);  // Log the session data
