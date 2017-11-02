// Config
const cfg = require('./config');

// Basic express stuff
const express = require('express');
const parser = require('cookie-parser');
const exphbs  = require('express-handlebars');

// App
const app = express();
module.exports = app;
app.use(parser());

// Render
app.engine('handlebars', exphbs());
app.set('views', `${__dirname}/src/views`);
app.set('view engine', 'handlebars');
app.disable('x-powered-by');
app.disable('etag');

// Route function for shortening purposes (no pun intended)
const route = file => require(`./src/routes/${file}`);

// Load DB
require('./src/utils/database');

/* Route */

// Shortened link
app.get('/random', route('random'));
app.get('/:link', route('link.js'));

// API/AJAX
app.get('/api/:link', route('api'));
app.get('/links', route('links'));
app.get('/new', route('new'));

// Visible
app.get('/big/:link', route('big'));
app.get('/qr/:link', route('qr'));
app.get('/', route('shortener'));

/* Route */

// Static Files
app.use(express.static(`${__dirname}/src/public`));

app.listen(cfg.port, () => console.log(`Listening on port ${cfg.port}`));