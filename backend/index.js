const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const app = express();

const routes = require('./src/routes');

const mongoURL = process.env.Mongo_URI;

mongoose.connect(mongoURL).then(() => {
    app.listen(3000, () => {
        console.log('App is running...');
    })
})

app.use(cors({ origin: true })); // Enable CORS (Cross-Origin Resource Sharing)
app.use(express.json());
app.use('', routes);

app.get('', (req, res) => {
    res.send("Request received");
});

mongoose.connect(MONGO_URI).then((client) => {
    app.listen(APP_PORT, () => {
        console.log(`Server running on port ${APP_PORT} and connected to MongoDB`);
    });
}).catch((err) => {
    console.log('Error connecting to the database...', err);
});