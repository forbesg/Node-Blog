const express = require('express');
const pug = require('pug');

const port = process.env.PORT || 3000;
const app = express();
const Router = require('./Router/Router');
const ApiRouter = require('./Router/ApiRouter');

app.use(express.static(__dirname + '/../client'));
app.set('view engine', 'pug');
app.set('views', __dirname + '/../client');
app.use('/api', ApiRouter);
app.use('/', Router);

app.listen(port, () => {
  console.log('Listening on port ' + port)
})
