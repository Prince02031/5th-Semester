const express = require('express');
const cors = require('cors');
const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 3000;


//middleware
app.use(cors()); // enable CORS for all routes
app.use(express.json());
app.use(express.static('public')); // serve static files from public folder 


//listen
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


//routes
const gameRoutes = require('./routes/gameRoutes');
const playerRoutes = require('./routes/playerRoutes');
const developerRoutes = require('./routes/developerRoutes');
const collaborationRoutes = require('./routes/collaborationRoutes');

app.use('/api/games', gameRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/developers', developerRoutes);
app.use('/api/collaborations', collaborationRoutes);


//monngodb connection
const mongoose = require('mongoose');
mongoose.connect(process.env.MongoDB_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

