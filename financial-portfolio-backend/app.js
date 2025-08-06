const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/api/test', (req, res) => {
  console.log("✅ /api/test route hit");
  res.send("Test route works!");
});

// Routes
const assetRoutes = require('./routes/assetRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const goalRoutes = require('./routes/goalRoutes');
const snapshotRoutes = require('./routes/snapshotRoutes');

app.use('/api/assets', assetRoutes);             
app.use('/api/transactions', transactionRoutes); 
app.use('/api/goals', goalRoutes);               
app.use('/api/snapshots', snapshotRoutes);       

app.get('/', (req, res) => {
  res.send('📊 Financial Portfolio Backend is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));