const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Export the variables for use in other parts of the app
module.exports = {
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/yourDatabaseName',
  PORT: process.env.PORT || 5000,
};
