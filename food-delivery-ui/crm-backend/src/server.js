require('dotenv').config();
require('express-async-errors');
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`CRM API listening on http://localhost:${PORT}`));
  })
  .catch((error) => {
    console.error('Could not start API:', error.message);
    process.exit(1);
  });
