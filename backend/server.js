const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import the cors package
const customerRoutes = require('./routes/customerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const branchRoutes = require('./routes/branchRoutes');
const headquartersRoutes = require('./routes/headquartersRoutes');
const drinkRoutes = require('./routes/drinkRoutes');
const cartRoutes = require('./routes/cartRoutes');


const app = express();
const PORT = process.env.PORT || 5002;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/drink-sales', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Middleware
app.use(express.json());
app.use(cors()); // Use cors middleware to enable CORS for all routes

// Routes
app.use('/api', customerRoutes);
app.use('/api', orderRoutes);
app.use('/api', branchRoutes);
app.use('/api', headquartersRoutes);
app.use('/api', drinkRoutes);
app.use('/api', cartRoutes); 

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
