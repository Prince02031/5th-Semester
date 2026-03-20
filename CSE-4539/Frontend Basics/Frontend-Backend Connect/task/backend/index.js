const express = require('express');
const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 3000;

const cors = require('cors');

// middleware
app.use(cors({
  origin: "http://localhost:1234", // React dev server
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true
}));

// app.use(cors());

//middleware
app.use(express.json()); 
app.use((req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    next();
});


//listen
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



//routes
const router = require('./routes/workoutRoutes');
// app.use(router);
app.use('/api/workouts',router);



//monngodb connection
const mongoose = require('mongoose');
mongoose.connect(process.env.MongoDB_URI).then(() => {
    console.log('Connected to MongoDB');
//     app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});


