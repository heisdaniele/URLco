const express = require('express');
const bodyParser = require('body-parser');
const shortid = require('shortid');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const urlDatabase = {};

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // Serve static files from root directory

// Serve the index.html file at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/shorten', (req, res) => {
    const { longUrl } = req.body;
    const shortUrl = shortid.generate();
    urlDatabase[shortUrl] = longUrl;
    res.json({ shortUrl: `${req.protocol}://${req.get('host')}/${shortUrl}` });
});

app.get('/:shortUrl', (req, res) => {
    const { shortUrl } = req.params;
    const longUrl = urlDatabase[shortUrl];
    if (longUrl) {
        res.redirect(longUrl);
    } else {
        res.status(404).send('URL not found');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});