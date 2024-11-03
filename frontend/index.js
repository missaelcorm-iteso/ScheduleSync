const express = require('express');
const path = require('path');
const app = express();
const PORT = 8080;

// Serve static files from public directory
app.use(express.static('public'));

// Handle all routes to support HTML5 History API
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});