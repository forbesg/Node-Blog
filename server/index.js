const express = require('express');
const pug = require('pug');
const filters = pug.filters;
const md = require('markdown').markdown;

const port = process.env.PORT || 3000;
const app = express();
const Router = require('./Router/Router');
const ApiRouter = require('./Router/ApiRouter');

// Pug filters
filters.getSummary = (string, options) => {
  let summary = string.substring(0, 50);
  console.log(summary, string, options);
  return summary;
}

app.locals.md = md;
app.locals.title = 'My Title set from locals';

app.use(express.static(__dirname + '/../client'));
app.set('view engine', 'pug');
app.set('views', __dirname + '/../client');
app.use('/api', ApiRouter);
app.use('/', Router);

app.listen(port, () => {
  console.log('Listening on port ' + port)
})
