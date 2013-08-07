
/**
 * Module dependencies.
 */

var express = require('express'),
  config = require('./config.json');

var app = module.exports = express.createServer();
var statuses = {};
var buildIds = [];

// Configuration
app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});


app.post('/fail', function(request,response){
  var id = request.body.build.buildId;
  if(!id){
  	response.send('Missing Build Id!');
    response.end();
    return;
  }
  console.log('fail -> id: ' + id);
  if(buildIds.indexOf(id) === -1) {
  	buildIds.push(id);
  }
  statuses[id] = false;
  response.send('OK');
  response.end();

});

app.post('/pass', function(request,response){
  var id = request.body.build.buildId;
  if(!id){
  	response.send('Missing Build Id!');
    response.end();
    return;
  }
  console.log('pass -> id: ' + id);
  if(buildIds.indexOf(id) === -1) {
  	buildIds.push(id);
  }
  statuses[id] = true;
  response.send('OK');
  response.end();
});

app.get('/status', function(request,response){
	for(var i = 0; i < buildIds.length; ++i) {
		if(!statuses[buildIds[i]]) {
      console.log('/status => red');
			response.send('RED');
      response.end();
      return;
		}
	}
  console.log('/status => green');
	response.send('GREEN');
  response.end();
});

app.get('/reset',function(request,response){
	buildIds = [];
	statuses = {};
  console.log('/reset');
  response.send('OK');
  response.end();
});

app.listen(config.appPort);
console.log("Master Status listening on port %d in %s mode", app.address().port, app.settings.env);