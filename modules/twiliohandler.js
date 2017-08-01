
var twilio = require('twilio');
var config = require('../config.js');
var client = new twilio(config.testAccountSid, config.testAuthToken);

module.exports = function() {
  this.sendSMS = function(number) {
    var twilioNumber = '+18482602680';
    client.messages.create({
        body: 'Hello from Node',
        to: number,
        from: twilioNumber
      })
      .then((message) => console.log(message.sid));
    }
}
