const express = require('express');
const pug = require('pug');
const md = require('markdown').markdown;

const port = process.env.PORT || 3000;
const app = express();
const Router = require('./Router/Router');
const ApiRouter = require('./Router/ApiRouter');

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
