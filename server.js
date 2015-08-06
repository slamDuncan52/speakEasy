/*----Twilio Account Info----*/
var accountSID;
var authToken;
var twiNumber;

/*----Requires----*/
var fs = require('fs');
var twilio = require('twilio');
var path = require('path');
var exec = require('child_process').exec,child;
var express = require('express');
var parser = require('body-parser');
var tunnel = require('localtunnel');

//Read credential file
var data = fs.readFileSync("credentials.txt","utf8");
var split = data.split('\n');
accountSID = split[0];
authToken = split[1];
twiNumber = split[2];

/*----Global Vars----*/
var twilioClient = twilio(accountSID, authToken);
var twiRes = twilio.TwimlResponse();
var http = express();
var tunnelCli;
var curDir = "/home";
var environ = process.env;
var trusted = [];

//Simplify accessing POST requests
http.use(parser.json());
http.use(parser.urlencoded({
        extended: true
}));

//Handle Requests
http.post('/', function(req, res) {
        if (trusted.indexOf(req.body.From) > -1) {
                if (req.body.Body === "exit") {
                        trusted.splice(trusted.indexOf(req.body.From), 1);
                        twilioClient.messages.create({
                                body: "Goodbye",
                                to: req.body.From,
                                from: twiNumber,
                        });
                } else {
                        textCommand(req.body.Body, req.body.From);
                }
        } else {
                verifyAttempt(req.body.Body, function(status) {
                        if (status) {
                                trusted.push(req.body.From);
                                twilioClient.messages.create({
                                        body: "Login successful!",
                                        to: req.body.From,
                                        from: twiNumber,
                                });
                        } else {
                                twilioClient.messages.create({
                                        body: "Incorrect login information. Send 'username password'",
                                        to: req.body.From,
                                        from: twiNumber,
                                });
                        }
                });
        }
});

//Start Server!!!
tunnelCli = tunnel(3000, {
        subdomain: "speakeasy"
}, function(err, tunnelCli) {
        var server = http.listen(3000, function() {
                var host = server.address().address;
                var port = server.address().port;
        });
        console.log(tunnelCli.url);
        console.log("Server started!");
});

//Handle login authentication
function verifyAttempt(input, callback) {
        var spl = input.split(" ");
        var comm = "echo " + spl[1] + " | sudo -u " + spl[0] + " -S ls";
        exec(comm, function(err, stdout, stderr) {
                if (stderr === "") {
                        callback(true);
                } else {
                        callback(false);
                }
        });
}

//Handle shell commands
function textCommand(command, phoneNumber) {
        //console.log("processing " + command);
        var child = exec(command, {
                cwd: curDir
        }, function(err, stdout, stderr) {
                //console.log("output: " + stdout);
                if (stdout === '') {
                        stdout = command + ' completed';
                }
                twilioClient.messages.create({
                        body: stdout,
                        to: phoneNumber,
                        from: twiNumber,
                });
        });
        commArr = command.split(' ');
        if (commArr.indexOf("cd") > -1) {
                curDir = path.resolve(curDir, commArr[commArr.indexOf("cd") + 1]);
        }
}
