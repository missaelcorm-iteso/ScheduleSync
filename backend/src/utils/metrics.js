const express = require('express');
const client = require('prom-client');
const register = new client.Registry();

register.setDefaultLabels({
    app: 'schedulesync-api'
})

const app = express();

const http_requests_total = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code']
});

const http_request_duration_milliseconds = new client.Histogram({
    name: 'http_request_duration_milliseconds',
    help: 'Duration of HTTP requests in milliseconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [1, 2, 3, 4, 5, 10, 25, 50, 100, 250, 500, 1000]
});

const startMetricsServer = () => {
    client.collectDefaultMetrics({register});
    register.registerMetric(http_request_duration_milliseconds);
    register.registerMetric(http_requests_total);

    app.get('/metrics', async (req, res) => {
        res.setHeader('Content-Type', register.contentType);
        
        return res.send(await register.metrics());
    });

    app.listen(9100, () => {
        console.log('Metrics server started on port 9100');
    });
}

module.exports = { startMetricsServer, http_request_duration_milliseconds, http_requests_total };