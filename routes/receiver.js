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
  jwt.verify(token, config.secret, function(err, decoded){
    if (!err) {
      interval = setInterval(receiveFunc(number),5000);
    } else {
      var response = {
        status : 'reauth',
        message : 'token not verified',
      };
      res.status(200).send(response);
    }
  });
});

function receiveFunc(number, res) {
  Number.findOne({'number' : number},function(err,num){
    var response;
    if (!err) {
      var update = num.updatedAt;
      var curr = new Date();
      var timepassed = update.getTime() - curr.getTime();
      if (timepassed > MAX_UPDATE && num.pings !== 0) {
        sendSMS(number);
        response = {
          status : 'alert',
          message : 'sending SMS'
        };
        clearInterval(interval);
      } else {
        response = {
          status : 'ok',
          message : 'update good'
        };
      }
   } else {
     console.log(err);
     response = {
       status : 'error',
       message : 'did not work: ' + err
     };
     clearInterval(interval);
   }
   res.status(200).send(response);
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
