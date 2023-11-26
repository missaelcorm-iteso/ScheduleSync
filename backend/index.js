const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

const routes = require('./src/routes/index');
const { login } = require('./src/controllers/login');
const user = require('./src/models/user');

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

mongoose.connect(MONGO_URI).then((client) => {
    app.listen(APP_PORT, () => {
        console.log(`Server running on port ${APP_PORT} and connected to MongoDB`);
    });
}).catch((err) => {
    console.log(err);
});

app.get('/home', (req, res) => {
    res.sendFile('/app/ScheduleSync/frontend/public/index.html');
})

app.get('/home/login', (req, res) => {
    res.sendFile('/app/ScheduleSync/frontend/public/login.html');
})

app.post('/home/login', async (req, res) => {
    try {
        await login(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/home/register', (req, res) => {
    res.sendFile('/app/ScheduleSync/frontend/public/register.html');
})

app.post('/home/register', async (req, res) => {
    const registerData = req.body;
    try {
        const register = new user(registerData);
        await register.save();
        res.status(201).json(register);
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error: 'There was an error creating the user.'
        });
    }
});

app.get('/home/login/user', (req, res) => {
    res.sendFile('/app/ScheduleSync/frontend/public/user.html');
})

app.get('/home/login/user/today', (req, res) => {
    res.sendFile('/app/ScheduleSync/frontend/public/today.html');
})

app.get('/home/login/user/todo-list', (req, res) => {
    res.sendFile('/app/ScheduleSync/frontend/public/todo.html');
})

app.get('/home/login/user/todo-list/add-task', (req, res) => {
    res.sendFile('/app/ScheduleSync/frontend/public/add-task.html');
})

app.get('/home/login/user/todo-list/edit-task', (req, res) => {
    res.sendFile('/app/ScheduleSync/frontend/public/edit-task.html');
})

app.get('/home/login/user/today/add-task', (req, res) => {
    res.sendFile('/app/ScheduleSync/frontend/public/add-task.html');
})

app.get('/home/login/user/today/edit-task', (req, res) => {
    res.sendFile('/app/ScheduleSync/frontend/public/edit-task.html');
})

app.get('/home/login/user/my-account', (req, res) => {
    res.sendFile('/app/ScheduleSync/frontend/public/my-account.html');
})
