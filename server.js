/*----Twilio Account Info----*/
var accountSID = "AC1662bc8ab0871857df0b5e53021d9c4b";
var authToken = "c1fea3932ed9c1ccae6fc3f34a3356da";

/*----Requires----*/
var twilio = require('twilio')
var twilioClient = twilio(accountSID, authToken);
var exec = require('child_process').exec,child;
var http = require('http');

var twiRes = twilio.TwimlResponse();
http.createServer(function(req,res){
        twiRes.say({voice:'woman'}, 'Welcome to Acme Corporation!');
        res.writeHead(200,{
                'Content-Type':'text/xml'
        });
        res.end(twiRes.toString());
}).listen(1337);

function textCommand(command,cb){
        exec(command, function(err,stdout,stderr){
                if(!stdout){
                        stdout = command+" finished\n";
                }
                twilioClient.messages.create({
                        body: stdout,
                        to: "+18108755224",
                        from: "+18102750107",
                },function(err,msg){
                        if(err){
                                console.log(err);
                        } else {
                                console.log(msg.body);
                                if(cb){
                                        cb();
                                }
                        }
                });
        });
}
textCommand("cd ~/.vim/bundle",function(){textCommand("ls")});
