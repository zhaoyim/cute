var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var config = require('./conf/config');

var search = require('./routes/search');
var types = require('./routes/types');
var details = require('./routes/details');
var add = require('./routes/add');
var remove = require('./routes/delete');
var edit = require('./routes/edit');

var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); //It need port also, like http://localhost:8080
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../', 'app')));

app.use('/api/search', search);
app.use('/api/types', types);
app.use('/api/details', details);
app.use('/api/add', add);
app.use('/api/delete', remove);
app.use('/api/edit', edit);

//// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//  var err = new Error('Not Found');
//  err.status = 404;
//  next(err);
//});
//
//// error handler
//app.use(function(err, req, res, next) {
//  // set locals, only providing error in development
//  res.locals.message = err.message;
//  res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//  // render the error page
//  res.status(err.status || 500);
//  res.render('error');
//});

module.exports = app;
