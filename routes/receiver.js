require('../modules/twiliohandler.js')();
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../config.js');
var Number = require('../models/Number.js');
const MAX_UPDATE = 5000;
var interval;
router.get('/receive', function(req,res,next){
  var number = req.query.number;
  var token = req.query.token;
  var first = req.query.first;
  var end = req.query.end;
  jwt.verify(token, config.secret, function(err, decoded){
    if (!err) {
      var isFirst = (first === 'True');
      var isEnd = (end === 'True');
      if (isFirst) {
        interval = setInterval(function() {receiveFunc(number,res);},5000);
        var response = {
          status : 'ok',
          message : 'interval set',
        };
        res.status(200).send(response);
      } else {
        var response = {
          status : 'ok',
          message : (isEnd ? 'manually cancelled' : 'number updated')
        };
        res.status(200).send(response);
      }
      var reset = isFirst || isEnd;
      updateNumber(number, reset);
    } else {
      var response = {
        status : 'reauth',
        message : 'token not verified',
      };
      res.status(200).send(response);
    }
  });
});

function updateNumber(number, first) {
  console.log("updating number")
  Number.findOne({'number' : number},function(err,num){
    num.pings = first ? 0 : (num.pings + 1);
    num.updatedAt = new Date();
    num.save(function(err) {
      if (err) {
        console.log("could not update pings");
      }
    });
  });
}

function receiveFunc(number, res) {
  Number.findOne({'number' : number},function(err,num){
    var response;
    if (!err) {
      var update = num.updatedAt;
      var curr = new Date();
      var timepassed = curr.getTime() - update.getTime();
      console.log("timepassed = " + timepassed);
      console.log("num pings = " + num.pings);
      if (timepassed > MAX_UPDATE && num.pings !== 0) {
        console.log("time is bad");
        sendSMS(number,res);
        clearInterval(interval);
      } else {
        if (num.pings === 0) {
          clearInterval(interval);
        } else {
          console.log("time is good");
        }
      }
   } else {
     console.log(err);
     response = {
       status : 'error',
       message : 'did not work: ' + err
     };
     clearInterval(interval);
     res.status(200).send(response);
   }
  });
}

function endFunc(number, res) {
  Number.findOne({'number' : number},function(err,num){
    var response;
    if (!err) {
      num.pings = 0;
      num.save(function(err){
        if (!err) {
          response = {
            status : 'ok',
            message : 'security ended'
          };
        } else {
          console.log(err);
          response = {
            status : 'error',
            message : 'pings not reset'
          };
        }
        res.status(200).send(response);
      });
    } else {
      console.log(err);
      response = {
        status : 'error',
        message : 'could not find number: ' + err
      };
      res.status(200).send(response);
    }
  });
}

module.exports = router;
