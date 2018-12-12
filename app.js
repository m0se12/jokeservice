const express = require('express');
const path = require('path');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);


app.all('/', function(request, response) {
  let html = '<h1>' + request.method+ ':/ </h1>';
  response.send(html);})
    .all('/:sti', function(request, response){
      let html = '<h1>' + request.method+ ': ' + request.params.sti+ '</h1>';
      response.send(html);
    }).listen(process.env.PORT || 8010);

module.exports = app;
