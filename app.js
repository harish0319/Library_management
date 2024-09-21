const express = require('express');
const path = require('path');
const sequelize = require('./config/connection');
const bookRoutes = require('./routes/bookRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to serve static files
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

//Book Routes
app.use('/api/books', bookRoutes);

// Route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//initialize the database and start the server
sequelize
    .sync()
    .then(() => {
        app.listen(PORT,() => console.log(`server running on http://localhost:${PORT}`));
    })
    .catch(err => console.log('Database sync failed:', err));