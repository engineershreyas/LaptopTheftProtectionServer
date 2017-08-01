var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../config.js');
var passhash = require('password-hash');
var Number = require('../models/Number.js');
var User = require('../models/User.js');

router.post('/register',function(req,res,next){
  var number = req.body.number;
  var password = req.body.password;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  registerUser(number, password, firstName, lastName, res);
});

function registerUser(number,password,firstName,lastName, res) {
  var user = {
    number : number,
    password : passhash.generate(password),
    fullname : (firstName + ' ' + lastName)
  };
  User.create(user,function(err, u){
     var response;
     if (!err) {
        createNumber(number,res);
     } else {
       response = {
         status : 'error',
         message : 'could not register: ' + err
       };
     }
     res.status(200).send(response);
  });
}

function createNumber(number, res) {
  var num = {
    number : number
  };
  Number.create(num, function(err, n){
    var response;
    if (!err) {
      response = {
        status : 'ok',
        message : 'registered',
        user : user
      };
    } else {
      response = {
        status : 'error',
        message : 'could not create number'
      };
    }
    res.status(200).send(response);
  });
}

router.post('/login', function(req,res,next){
  var number = req.body.number;
  var password = req.body.password;
  loginUser(number,password,res);
});

function loginUser(number,password,res) {
  var response;
  User.findOne({'number' : number}, function(err, u){
    var hash = u.password;
    var success = passhash.verify(password,hash);
    if (success) {
      jwt.sign(u, config.secret, {expiresIn: 432000}, function(err, token){
        if (!err) {
          response = {
            status : 'ok',
            message : 'logged in successfully',
            token : token
          };
        } else {
          response = {
            status : 'error',
            message : 'token signing failed' + err
          };
        }
      });
      res.status(200).send(response);
    } else {
      response = {
        status : 'error',
        message : 'invalid number or password'
      }
      res.status(200).send(response);
    }
  });
}

module.exports = router;
