var fs = require("fs");
var path = require("path");

var conf = require("./conf.js");
var game = require("./game.js");

function errorResponse(response, code) {
  console.log("Serving error " + code);
  if(typeof(code) === "undefined")
    code = 500;
  response.setHeader("Content-Type", "text/html; charset=utf8");
  response.writeHead(code);
  fs.readFile(path.join(conf.template_dir, 'error.html'), function(err, data) {
    response.write(data);
    response.end();
  });
}

var mimeTypes = {
  "HTML": "text/html",
  "TXT": "text/plain",
  "CSS": "text/css",
  "PNG": "image/png",
};

function serveStatic(response, pathname) {
  console.log("Serving static '" + pathname + "'");
  var localFile = path.join(conf.static_dir, pathname);
  console.log("Which is '" + localFile + "'");
  path.exists(localFile, function (exists) {
    if (!exists) {
      //TODO: This returns true for Directories too
      errorResponse(response, 404);
      return;
    }
    response.setHeader("Content-Type", mimeTypes[path.extname(pathname).substring(1).toUpperCase()]);
    response.writeHead(200);
    fs.readFile(localFile, function(err, data) {
      response.write(data);
      response.end();
    });
  });
}

function route(pathname, response, postData) {
  console.log("Routing " + pathname);
  if (pathname === "/")
    return game.index(response);
  if (pathname.substring(0, 8) === "/static/")
    return serveStatic(response, pathname.substring(8));
  if (pathname.match(/^\/[0-9a-zA-Z]{6}$/)) {
    return game.gamePage(response, pathname.substring(1));
  errorResponse(response);
}

exports.route = route

// vi: set et sta sw=2 ts=2:
