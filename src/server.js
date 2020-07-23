const express = require('express'); // Imports ExpressAPI Library
const exphbs = require('express-handlebars');

const path = require('path');
const methodOverride = require('method-override');

const session = require('express-session');
const flash = require('connect-flash');

const passport = require('passport');
const morgan = require('morgan');

const connectMongo = require('connect-mongo');
const mongoose = require('mongoose'); // Imports Mongoose API library

const app = express(); // Creates an instance of express
require('./config/passport');

app.set('port', process.env.PORT || 4000); // Set the port number to listen for incoming requests
app.set('views', path.join(__dirname, 'views'));

app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs'
}));

app.set('view engine', '.hbs');
app.use(morgan('dev')); // Uses the morgan middleware

app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));

const MongoStore = connectMongo(session);
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

app.use(require('./routes/index.routes')); // Uses the index routes
app.use(require('./routes/users.routes')); // Makes use of the users routes
app.use(require('./routes/notes.routes'));

// static files
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app; // Exports the app module
