var fs = require('fs');

/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var allPreviousMessages = [
  {
    username: 'Jono',
    message: 'Do my bidding!',
    text: 'Do my bidding!',
    objectId: 1
  }];

var endResponse = function(response, statusCode, headers, responseStr) {
  response.writeHead(statusCode, headers);
  response.end(responseStr);
};


var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  var headers = {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'access-control-allow-headers': 'content-type, accept',
    'access-control-max-age': 10, // Seconds.
    'Content-Type': 'application/json'
  };

  var htmlHeaders = {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'access-control-allow-headers': 'content-type, accept',
    'access-control-max-age': 10, // Seconds.
    'Content-Type': 'text/html'
  };
  // check the type of request method
  // The outgoing status.
  var statusCode = 200;
  var responseObj = {results: []};
  
  
  if (request.method === 'GET') {
    if (request.url === '/classes/messages?order=-createdAt' || request.url === '/classes/messages') {
      responseObj.results = allPreviousMessages;
      endResponse(response, statusCode, headers, JSON.stringify(responseObj));
    } else if ( request.url === '/index.html' ) {
      var htmlResponseObj = '<h1>Hello World!</h1>';     
      endResponse(response, statusCode, htmlHeaders, htmlResponseObj);
    } else { // do URL parsing
      statusCode = 404;    
      endResponse(response, statusCode, headers, JSON.stringify(responseObj));
    }
    
  } else if (request.method === 'POST') {
    if (request.url === '/classes/messages') {
      var currentMessage = [];
      request.on('error', (err) => {
        console.log('error', err);
      });
      request.on('data', (chunk) => {
        if (Buffer.isBuffer(chunk)) {
          currentMessage.push(chunk);
        }
      });
      request.on('end', () => {
        if (currentMessage.length > 0) {
          var newMessage = JSON.parse(Buffer.concat(currentMessage).toString('utf-8'));
          newMessage.objectId = allPreviousMessages.length + 1;
          allPreviousMessages.push(newMessage);
        }
        statusCode = 201;
        endResponse(response, statusCode, headers, JSON.stringify(responseObj));
      });
    }
  } else if (request.method === 'OPTIONS') {
    endResponse(response, statusCode, headers, JSON.stringify(responseObj));
  }



};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.


requestHandler.requestHandler = requestHandler;
module.exports = requestHandler;

