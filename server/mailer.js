var nodemailer = require('nodemailer'),
	fs = require('fs');

var mailer = {}

// get pw from environment variable
var pw = process.env._oakgisPW

function log(a){
	console.log(a);
}
log(pw)

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport('SMTP',{
    service: 'Gmail',
    auth: {
        user: 'ursoaklandgis@gmail.com',
        pass: pw
    }
});

// setup e-mail data
mailer.mailOptions = function(to,cc,subject, html, attachments){
	var options = {
		from: 'Oakland GIS <ursoaklandgis@gmail.com>', // sender address
		to: to || 'ben.kane@urs.com', // list of receivers
		cc: cc || 'Oakland GIS <ben.kane@urs.com>',
		subject: subject || 'Your data dictionary submission', // Subject line
		// text: 'Your submission is attached.  You will be contacted by GIS about your request soon.', // plaintext body
		// generateTextFromHTML : true,
		html: html || '<div>Your submission is attached.<br/>You will be contacted by GIS about your request soon.</div><div><img src="http://d2i8899knslxjr.cloudfront.net/wp-content/themes/urs/include/images/logo.png"></div>', // html body
		forceEmbeddedImages: true,
		attachments: attachments
	};
	return options
}

// send mail with defined transport object
mailer.sendmail = function(mailOptions){
	smtpTransport.sendMail(mailOptions, function(error, response){
		if(error){
			log(error);
		}else{
			log('Message sent: ' + response.message);
		}

		// if you don't want to use this transport object anymore, uncomment following line
		//smtpTransport.close(); // shut down the connection pool, no more messages
	});
}

module.exports = mailer;