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

// Routes
app.get('/random', route('random'));
app.get('/api/:link', route('api'));
app.get('/new', route('new'));
app.get('/big/:link', route('big'));
app.get('/qr/:link', route('qr'));
app.get('/', route('shortener'));
app.use('/:link', route('link.js'));

// Static Files
app.use(express.static(`${__dirname}/src/public`));

app.listen(cfg.port, () => console.log(`Listening on port ${cfg.port}`));