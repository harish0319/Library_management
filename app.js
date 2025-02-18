const express = require('express');
const path = require('path');
const sequelize = require('./config/connection');
const bookRoutes = require('./routes/bookRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/books', bookRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

sequelize
    .sync()
    .then(() => {
        app.listen(PORT,() => console.log(`server running on http://localhost:${PORT}`));
    })
    .catch(err => console.log('Database sync failed:', err));