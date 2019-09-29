const express = require('express');
const path = require('path');
const createError = require('http-errors');
const hbs = require('hbs');
const app = express();


// Route Variables
const indexRoute = require('./routes/index');
const speakersRoute = require('./routes/speakers');
const feedbackRoute = require('./routes/feedback');

// Variables
const PORT = 3000;
const configs = require('./config.json'); //get the json file in
const config = configs[app.get('env')]; // load configuration for production or development mode. Production mode can be set with a one time command: $env:NODE_ENV="production"

// DataBase Replacement
const SpeakerService = require('./data/SpeakerService');
const speakerService = new SpeakerService(config.data.speakers);
const FeedbackService = require('./data/FeedbackService');
const feedbackService = new FeedbackService(config.data.feedback);

// Templates
hbs.registerPartials(path.join('./views', 'partials', 'global'));
hbs.registerPartials(path.join('./views', 'partials', 'index'));
app.set('view engine', 'hbs');
app.set('views', './views'); // note '../' at the end

// JSONification
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static routes
app.use(express.static('public'));
app.get('/favicon.ico', (req, res, next) => { res.sendStatus(204) });

// Template variables
app.locals.title = config.title; // this app.locals is available everywhere, but be careful not to override it's built-in parameters
app.use(async (req, res, next) => {
  try {
    const names = await speakerService.getNames();
    res.locals.speakerNames = names;
    next();
  }
  catch(err) {
    return next(err);
  }
});

// Routes
app.use('/', indexRoute({speakerService})); // ain't ordinary middleware, but a ROUTING MIDDLEWARE. It will react to '/' regardless of using GET or POST
app.use('/speakers', speakersRoute({speakerService}));
app.use('/feedback', feedbackRoute({feedbackService}));

// ERROR MANAGEMENT
// 1. create a custom 404 error for amy page not matching the routes
app.use((req, res, next) => {
  return next(createError(404, 'File not found'));
});

// 2. Error management
app.use((err, req, res, next) => {
  const status = err.status || 500
  res.status(status);
  res.locals = {
    message: err.message,
    status: status,
    errStack: err.stack,
  }
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  return res.render('error');
})  

app.listen(PORT, () => console.log('\x1b[32m', `>>> Server URL: http://localhost:${PORT}`, '\x1b[0m'));
module.export = app;