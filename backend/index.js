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
    MONGO_PORT,
    MONGO_DB,
    MONGO_USER,
    MONGO_PASS,
    MONGO_ARGS,
    CERT_PATH,
} = process.env;

const APP_PORT = process.env.APP_PORT || 3000;

const _MONGO_PORT = MONGO_PROTOCOL == "mongodb+srv" ? '' : `:${MONGO_PORT}`;

const MONGO_URI = `${MONGO_PROTOCOL}://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}${_MONGO_PORT}/${MONGO_DB}?${MONGO_ARGS}`;

let MONGO_CONNECTION_OPTIONS = {};

if (CERT_PATH) {
    MONGO_CONNECTION_OPTIONS = {
        tls: true,
        tlsCAFile: path.resolve(CERT_PATH),
    };
}

app.use(cors({ origin: true })); // Enable CORS (Cross-Origin Resource Sharing)
app.use(express.json());

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
    res.send({"message": "Request received"});
});

mongoose.connect(MONGO_URI, MONGO_CONNECTION_OPTIONS).then((client) => {
    app.listen(APP_PORT, async () => {
        console.log(`Server running on port ${APP_PORT} and connected to MongoDB`);

        startMetricsServer();
    });
}).catch((err) => {
    console.log(err);
});