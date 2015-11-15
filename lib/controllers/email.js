/**
 * Email module,
 * This module support sending emails.
 * @author opinioncurrent.com
 */

'use strict';
var nodemailer = require('nodemailer');
var config     = require("../config/config");
var ok         = require("okay");

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: config.smtp_user,
    pass: config.smtp_password
  }
});

function sendEmail(message, callback) {

// send the message and get a callback with an error or details of the message that was sent
  transporter.sendMail(message,
                       ok(callback, function(message) {
                         return callback(null, message);
                       })
  );
}

module.exports.sendEmail = sendEmail;



