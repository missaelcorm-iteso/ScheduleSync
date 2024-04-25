const Prometheus = require('prom-client');
const register = new Prometheus.Registry();

register.setDefaultLabels({
    app: 'schedulesync-api'
})
Prometheus.collectDefaultMetrics({register})

const http_requests_total = new Prometheus.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code']
});

register.registerMetric(http_requests_total);

const http_request_duration_milliseconds = new Prometheus.Histogram({
    name: 'http_request_duration_milliseconds',
    help: 'Duration of HTTP requests in milliseconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [1, 2, 3, 4, 5, 10, 25, 50, 100, 250, 500, 1000]
});

register.registerMetric(http_request_duration_milliseconds);

const increment = (req, res, next) => {
    http_requests_total.labels({ method: req.method, route: `/${req.originalUrl.split('/')[1]}` , status_code: res.statusCode }).inc();
    next();
};

const duration = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        http_request_duration_milliseconds.labels({ method: req.method, route: `/${req.originalUrl.split('/')[1]}`, status_code: res.statusCode }).observe(duration);
    });
    next();
}

class promController {
    metrics(req, res) {
        res.setHeader('Content-Type', register.contentType);
        register.metrics().then((data) => res.status(200).send(data));
    }

   
}

module.exports = { promController: new promController(), increment, duration };