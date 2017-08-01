
var twilio = require('twilio');
var config = require('../config.js');
var client = new twilio(config.liveAccountSid, config.liveAuthToken);

module.exports = function() {
  this.sendSMS = function(number,res) {
    var twilioNumber = '+18482602680';
    console.log("sending sms to : " + number);
    client.messages.create({
        body: 'Your laptop has stopped broadcasting, please check on it immediately',
        to: number,
        from: twilioNumber
      }, function(err, message){
        if (err) {
          console.log(err.message);
        }
      });
    }
}
