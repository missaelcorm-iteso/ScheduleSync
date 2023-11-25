const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

const routes = require('./src/routes/index');

const {
    MONGO_PROTOCOL,
    MONGO_HOST,
    MONGO_DB,
    MONGO_USER,
    MONGO_PASS,
} = process.env;

const APP_PORT = process.env.APP_PORT || 3000;

const MONGO_URI = `${MONGO_PROTOCOL}://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}/${MONGO_DB}?retryWrites=true&w=majority`;

app.use(cors({ origin: true })); // Enable CORS (Cross-Origin Resource Sharing)
app.use(express.json());
app.use('/', routes);

app.get('/', (req, res) => {
    res.send("Request received");
});

app.get('/home', (req, res) => {
    res.sendFile('/app/ScheduleSync/frontend/public/index.html');
})


mongoose.connect(MONGO_URI).then((client) => {
    app.listen(APP_PORT, () => {
        console.log(`Server running on port ${APP_PORT} and connected to MongoDB`);
    });
}).catch((err) => {
    console.log(err);
});

