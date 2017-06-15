const express = require('express');
const app = express();
const helmet = require('helmet');
const pug = require('pug');
const filters = pug.filters;
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const sass = require('node-sass-middleware');
const path = require('path');

const port = process.env.PORT || 3000;
const development = process.env.NODE_ENV === 'development' ? true : false;

console.log(development);

app.use(helmet());
app.use(session({
  secret: 'yosemite sam',
  resave: false,
  saveUninitialized: false,
  cookie: {
    name: 'node_blog'
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// Import Database Connection
require('./Router/models/database');

// Pug filters
filters.getSummary = (string, options) => {
  let summary = string.substring(0, 50);
  return summary;
}

app.locals.site_title = 'My Special Site';
app.locals.title = 'Page Title';


app.set('view engine', 'pug');
app.set('views', __dirname + '/../views');

app.use(sass({
  src: path.join(__dirname, '/../public/css/scss/'),
  dest: path.join(__dirname, '/../public/css/'),
  prefix: '/css'
}));

app.use(express.static(path.join(__dirname, '/../public')));

app.use(flash());



require('./Router/AdminRouter')(app, passport);
require('./Router/UserRouter')(app, passport);
require('./Router/Router')(app, passport);

app.listen(port, () => {
  console.log('Listening on port ' + port)
})
