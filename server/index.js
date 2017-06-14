const express = require('express');
const app = express();
const pug = require('pug');
const filters = pug.filters;
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');

const port = process.env.PORT || 3000;
app.use(session({ secret: 'secretsessiontoken', resave: false, saveUninitialized: false}))
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
app.use(express.static(__dirname + '/../public'));

app.use(flash());
const checkAuth = function (req, res, next) {
  if (!req.user) return res.redirect('/login');
  next();
}

/*****
Admin (protected Routes)
*****/

// Check User is authenticated when accessin Admin routes
app.all('/admin/*', checkAuth)

require('./Router/AdminRouter')(app, passport);
require('./Router/UserRouter')(app, passport);
require('./Router/Router')(app, passport);

app.listen(port, () => {
  console.log('Listening on port ' + port)
})
