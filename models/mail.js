/*
author: wingkwong
*/

var nodemailer = require("nodemailer");

var Mail = function (){};

var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "scheduleland.sepj@gmail.com",
        pass: "sepj201617"
    }
});

Mail.resetsend = function(o, callback){
	o = o || {};
	var mailOptions = {
		from: "SCHEDULELAND <scheduleland.sepj@gmail.com>", 
		to: o.email, 
		subject: o.subject || "Forget Password",
		html: o.html || "<div>Somebody recently asked to reset your password. <b> <a href='http://localhost:10880/user/resetPassword/" + o.token + "'>Click here to change your password</a></div>" 
	};

	smtpTransport.sendMail(mailOptions, function(err, res){
		if(err){
			console.log(err);
			callback(err);
		}else{
			callback(null, res);
		}
	});	
}

Mail.remindersend = function(o, callback){
	o = o || {};
	event = event || {};
	var mailOptions = {
		//{"send_at": 1409348513}
		from: "SCHEDULELAND <scheduleland.sepj@gmail.com>", 
		to: o.email, 
		subject: o.subject || "Event Reminder",
		html: o.html || "<div>Hello,you have joined an event from SCHEDULELAND. The event's detail as below:"+event+"Please attend the event puntuatlly. Thank you for your attention!</div>" 
	};

	smtpTransport.sendMail(mailOptions, function(err, res){
		if(err){
			console.log(err);
			callback(err);
		}else{
			callback(null, res);
		}
	});	
}

module.exports = Mail;