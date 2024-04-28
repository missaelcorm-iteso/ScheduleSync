const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const responseTime = require('response-time');
const { startMetricsServer, http_request_duration_milliseconds, http_requests_total } = require('./src/utils/metrics');

require('dotenv').config();

const app = express();

const routes = require('./src/routes');

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
app.use('/assets', express.static(path.join(__dirname, 'uploads')));

app.use(
    responseTime((req, res, time) => {
        if (req?.route?.path) {
            http_request_duration_milliseconds.observe(
                {
                    method: req.method,
                    route: req.route.path,
                    status_code: res.statusCode
                }, 
                time
            );
        } else {
            http_request_duration_milliseconds.observe(
                {
                    method: req.method,
                    route: req.url,
                    status_code: res.statusCode
                }, 
                time
            );
        }
    })
);

app.use((req, res, next) => {
    res.on('finish', () => {
        if (req?.route?.path) {
            http_requests_total.inc({
                method: req.method,
                route: req.route.path,
                status_code: res.statusCode
            });
        } else {
            http_requests_total.inc({
                method: req.method,
                route: req.url,
                status_code: res.statusCode
            });
        }
    });
    next();
});

app.use('', routes);

app.get('', (req, res) => {
    res.send("Request received");
});

mongoose.connect(MONGO_URI).then((client) => {
    app.listen(APP_PORT, async () => {
        console.log(`Server running on port ${APP_PORT} and connected to MongoDB`);

        startMetricsServer();
    });
}).catch((err) => {
    console.log(err);
});