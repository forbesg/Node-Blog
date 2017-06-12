const express = require('express');
const pug = require('pug');
const filters = pug.filters;
const md = require('markdown').markdown;
const app = express();
const session = require('express-session');
const passport = require('passport');

const port = process.env.PORT || 3000;
app.use(session({ secret: 'secretsessiontoken', resave: false, saveUninitialized: true}))
app.use(passport.initialize());
app.use(passport.session());

const ApiRouter = require('./Router/ApiRouter');

// Pug filters
filters.getSummary = (string, options) => {
  let summary = string.substring(0, 50);
  return summary;
}

app.locals.md = md;
app.locals.title = 'My Title set from locals';


app.set('view engine', 'pug');
app.set('views', __dirname + '/../views');
app.use(express.static(__dirname + '/../public'));

app.use('/api', ApiRouter);
require('./Router/Router')(app, passport);

app.listen(port, () => {
  console.log('Listening on port ' + port)
})
