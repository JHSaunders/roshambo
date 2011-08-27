#!/usr/bin/env node
var http = require("http");
var url = require("url");

var conf = require("./server/conf");
var router = require("./server/router");

function handleRequest(request, response) {
  var postData = "";
  var pathname = url.parse(request.url).pathname;
  //console.log("Request for " + pathname + " received.");

  request.setEncoding("utf8");
  request.addListener("data", function(postDataChunk) {
    postData += postDataChunk;
    console.log("Received POST data chunk '" + postDataChunk + "'.");
  });
  request.addListener("end", function() {
    router.route(pathname, request, response, postData);
  });
};

if (conf.production) {
  process.on('uncaughtException', function (err) {
      console.log('Caught exception: ' + err);
  });
}

http.createServer(handleRequest).listen(conf.port);
console.log("Listening on port " + conf.port);

// vi: set et sta sw=2 ts=2:
