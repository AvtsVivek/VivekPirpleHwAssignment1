/*
* Work in progress for index.js
* 
* 
*/

// Dependencies
var http = require('http');
//var fs = require('fs');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config'); // ./config.js is not required. Node is smart engough.

var httpServer = http.createServer(function(req, res){
    unifiedServer(req, res);
});

// All the server logic for both https and http.
var unifiedServer = function(req, res){
    // Get the URL and parse it. 
    var parsedUrl = url.parse(req.url, true);

    // Get the path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g,'');

    // Get the query string object. 
    var queryStringObject = parsedUrl.query;

    // Get the request method.
    var requestMethod = req.method.toLowerCase();

    // Get the headers as an object.
    var headers  = req.headers;

    // Get the payload if there is any.
    var decoder = new StringDecoder('utf-8');

    var buffer = '';

    req.on('data', function(data){
        buffer += decoder.write(data);
    });

    req.on('end', function(){
        buffer += decoder.end();

        // Choose the handler this request should go to. If one is not found, choose not found.
        var chooseHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound
        console.log(trimmedPath);
        console.log(chooseHandler);
        // Construct the data object to send to the handler.

        var data  = {
            'trimmedPath':trimmedPath,
            'queryStringObject': queryStringObject,
            'method':requestMethod,
            'headers': headers,
            'payload': buffer
        };

        // Now route the request specified in the router.
        
        chooseHandler(data, function(statusCode, payload){
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            payload = typeof(payload) == 'object' ? payload : {};

            // Convert the payload to string.
            var payloadString = JSON.stringify(payload);

            // Send the response
            // First set the content type header to application/json. 
            res.setHeader('content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            console.log('Returning the response ', statusCode + ' with the payload ' + payloadString );
        });          
        
        // Log the request path. 
        //console.log('Request received on path:' + trimmedPath + ' with the method ' + requestMethod + " with these query string parameters ", queryStringObject);
        //console.log('Request received with these headers:' + headers);
        //console.log('Request received with these headers:' + JSON.stringify(headers));
        //console.log('Request recieved with this payload', buffer);
    });
}

httpServer.listen(config.httpPort, function(){
    console.log('The server is listning on port ' + config.httpPort + ' in ' + config.envName + ' mode');
});

// Handlers object
var handlers = {}
handlers.sample = function(data, callback){
    // Callback a http status code and a payload object.
    callback(406, {'name': 'sample handler'});
}

handlers.hello = function(data, callback){
    // Callback a http status code and a payload object.
    callback(200, {'name': 'Hi, Welcome to Viveks api.'});
}

handlers.ping = function(data, callback){
    callback(200);
}

handlers.notFound = function(data, callback){
    callback(404);
}


// Define a router
var router = {
    'sample' : handlers.sample,
    'ping' : handlers.ping,
    'hello' : handlers.hello
}
