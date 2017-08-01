var PORT = process.env.PORT || 3000;

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('./config');

var app = express();

var user = require('./routes/user');
var receiver = require('./routes/receiver');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

var http = require('http').Server(app);

var mongoose = require('mongoose');
mongoose.connect(config.localDatabase, function(err){
  if (err) {
    console.log('unable to connect to mongodb');
    return;
  }
  console.log('successful connection to mongodb');
});


http.listen(PORT, function(){
  console.log('listening on PORT: ' + PORT);
});

app.use('/users',user);
app.use('/main',receiver);

module.exports = app;
