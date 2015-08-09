var os=require('os');
var http=require('http');
var express=require('express');
var ejs=require('ejs');
var bodyParser = require('body-parser');
var emby=require('EMBYInterface');
var dune=require('DUNEInterface');
var fs = require('fs');//filesystem
var app=express();
app.use(bodyParser.json());
app.engine('html', ejs.__express);
app.set('view engine', 'html');

var settings="settings.dune";
var defaultPort=3000;
var embyPort=8096;
var currentData={};
var isRunning=false;
fs.readFile(settings, {encoding:"utf8"}, function(err, data){
    if(err || !data){
        currentData={Html:{PORT:defaultPort}, Server:{PORT:embyPort, IP:"", PASSWORD:""}, Dune:{IP:""}, Video:{IP:"", PASSWORD:"", USERNAME:""}, Audio:{IP:"", PASSWORD:"", USERNAME:""}};
        //data.html={};
       // data.html.port=defaultPort;
        fs.appendFile(settings, JSON.stringify(currentData));
    }
    else {
        currentData=JSON.parse(data);
        if(currentData.Server.IP){ //only load emby if server actually exists in settings
          emby.setClient(new dune(currentData));
          emby.launch(function(data){});
        }
    }
    emby=new emby(currentData);

    var server = app.listen(currentData.Html.PORT, function () {
        var host = server.address().address;
        var port = server.address().port;
        console.log('Dune client app listening at http://%s:%s', host, port);
    });
});
function getSettings(res){
    fs.readFile(settings, function(err, data){
        if(err){
            //fs.appendFile(settings, JSON.stringify({html:{port:defaultPort}})); //default setting
            console.log(err);
        }
        else {
            //var relevantData=JSON.parse(data);
            var dataToSend=JSON.parse(data);
            //console.log(dataToSend);
            dataToSend.running=emby.isRunning();
            res.render("index", {data:dataToSend});
        }
    });
}
app.post('/testEmby', function(req, res){
    console.log(req.body);
    currentData.Server=req.body;
    emby.setAuthentication(currentData);
    emby.testConnection(function(data){res.send({result:data});});
});
app.post('/save', function(req, res){
    console.log(req.body);
    currentData=req.body;
    fs.writeFile(settings, JSON.stringify(currentData), function(err, data){
        if(err){
            res.send(err);
            //console.log(err);
        }
        else {
            res.send({result:"Success"});
        }
    });
});
app.post('/start', function(req, res){
    emby.setClient(new dune(currentData));
    emby.launch(function(data){res.send({result:data});});

});
app.get('/', function(req, res){
    getSettings(res);
    //res.render("index");
});
