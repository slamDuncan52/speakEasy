/*----Twilio Account Info----*/
var accountSID = "AC1662bc8ab0871857df0b5e53021d9c4b";
var authToken = "c1fea3932ed9c1ccae6fc3f34a3356da";
/*----Requires----*/
var twilio = require('twilio');
var fs = require('fs');
var exec = require('child_process').exec,child;
var express = require('express');
var parser = require('body-parser');

/*----Global Vars----*/
var twilioClient = twilio(accountSID, authToken);
var twiRes = twilio.TwimlResponse();
var twiNumber = "+18102750107";
var http = express();
var curDir = "/home";
var environ = process.env;

http.use(parser.json());
http.use(parser.urlencoded({extended: true}));

http.post('/',function(req,res){
	textCommand(req.body.Body,req.body.From);
});

var server = http.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;
});

function textCommand(command,phoneNumber,cb){
	exec(command,{cwd: curDir},
	     function(err,stdout,stderr){
		     if(stdout === ""){
			     stdout = command+" finished\n";
		     }
		     twilioClient.messages.create({
			     body: stdout,
			     to: phoneNumber,
			     from: twiNumber,
		     },function(err,msg){
			     if(err){
				     console.log(err);
			     } else if(cb){
				     cb();
			     }
		     });
	     });
}
