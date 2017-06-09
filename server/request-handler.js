const fs = require('fs');
const url = require('url');
const path = require('path');

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

  var statusCode = 200;
  var responseObj = {results: []};
  var pathName = url.parse(request.url).pathname;
  

  var apiCall = function() {
    if (request.method === 'GET') {
      responseObj.results = allPreviousMessages;
      endResponse(response, statusCode, headers, JSON.stringify(responseObj));

    } else if (request.method === 'POST') {
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
    } else if (request.method === 'OPTIONS') {
      endResponse(response, statusCode, headers, JSON.stringify(responseObj));
    } 
  };
  
  var htmlCall = function(pathname) {
    var htmlResponseObj = '<h1>Hello World!</h1>'; 
    // console.log(__dirname)
    fs.readFile('./client' + pathname, (err, data) => {
      if (err) { 
        console.log(err);
        endResponse(response, 404, htmlHeaders, '<h1>ERROR 404</h1>'); 
      } else {
        endResponse(response, 200, htmlHeaders, data); 
      }
      console.log(data);
    });

    ///Users/student/code/hrsf78-chatterbox-server/server
    // endResponse(response, statusCode, htmlHeaders, htmlResponseObj);
  };

  if (pathName === '/classes/messages') {
    apiCall();
  } else {
    htmlCall(pathName);
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

