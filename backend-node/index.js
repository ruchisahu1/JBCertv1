const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected ✅"))
    .catch((err) => console.log("MongoDB Error ❌:", err));

// Test Route
app.get('/', (req, res) => {
  res.json({ message: 'Hello World from Express with MongoDB!' });
});

app.listen(port, () => {
  console.log(`Node backend running on port ${port}`);
});
