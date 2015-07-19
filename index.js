var os=require('os');
var dgram = require('dgram');
var http=require('http');
var sha1 = require('sha1');
var md5 = require('md5');
var request = require('request');


//var app = http.createServer(handler)
//var io = require('socket.io')(app);

//var userId; //emby variable
var deviceId="77f6b3d2-3208-4e5d-a625-d20d3a97b2bb"; //emby variable
var client="Android";//emby variable
var version="1.0.0.2";//emby variable
var device="Dune Player 2"; //emby variable
//var sessionId;
var password="herbert";
var ip="192.168.0.108";
var port="8096";


//this kicks off everything...gets users
http.get(
	{
		host: ip,
		port:port,
		path: "/mediabrowser/Users/public?format=json"
	},
	getUserIDs);

function getUserIDs(res){
		var res_data = '';
  	res.on('data', function(chunk) {
    	res_data += chunk;
  	});
  	res.on('end', function() {
    	res_data=JSON.parse(res_data);
    	var defaultUserId=res_data[0].Id;//at some point, let this be picked during options of webbrowser
    	var defaultName=res_data[0].Name;
    	//console.log(res_data);
    	authenticate(defaultName, defaultUserId);
  	});
}
function authenticate(name, userId){
	var host=ip+":"+port;
	var content={username:name, password:sha1(password)};
	var url="http://"+host+"/mediabrowser/Users/AuthenticateByName?format=json";
	var header=getHeader(userId);
	request({
		url:url,
		method:'post',
		json:content,
		headers:header,
	}, function(err, res, body){getAccessToken(err, res, body, userId);});

}
function getHeader(userId){
	return {"Authorization":'MediaBrowser UserId="'+userId+'", Client="'+client+'", Device="'+device+'", DeviceId="'+deviceId+'", Version="'+version+'"', "content-type": "application/json"};
}
function getAccessToken(err, res, body, userId){ //retreives access token and gets session attributes
	var accessToken=res.body.AccessToken;
	var url="http://"+ip+":"+port+ "/mediabrowser/Sessions?DeviceId=" + deviceId + "&format=json";
	var header=getHeader(userId);
	header["X-MediaBrowser-Token"]=accessToken;
	request({
		url:url,
		method:'get',
		headers:header,
		json:true
	}, function(err, res, body){duneInterface(err, res, body, userId, accessToken);});

}
function setSession(userId, accessToken){
		console.log("I got here!");
		//var sessionId=res.body[0].Id;
		var header=getHeader(userId);
		header["X-MediaBrowser-Token"]=accessToken;
		var url = "http://"+ip+":"+port+ "/mediabrowser/Sessions/Capabilities/Full";//?format=json";
		var supportedCommands="Play,Playstate,SendString,DisplayMessage,PlayNext";
		var playableMediaTypes = "Audio,Video";
		var content={
			//"Id":sessionId,
			"PlayableMediaTypes":playableMediaTypes,
			"SupportedCommands": supportedCommands,
			"SupportsMediaControl":true
			//"SupportsRemoteControl":true //for some reason, this isn't "catching"
		};
		//console.log(content);
		request({
			url:url,
			method:'post',
			json: content,
			headers:header
		}, function(err, res, body){duneInterface(err, res, body, accessToken, userId);});
}
function duneInterface(err, res, body,  userId, accessToken){
	//console.log(err); //no error...
	//console.log(body); //no body..

	var socket=require('socket.io-client')("ws://"+ip+":"+port+"?api_key="+accessToken+"&deviceId="+deviceId);
	socket.on('connect', function(){setSession(userId, accessToken);});
	socket.on('disconnect', function(data){console.log(data);});
	socket.on('event', function(data){
		console.log(data);
	});
}
