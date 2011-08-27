var fs = require("fs");
var path = require("path");

var conf = require("./conf.js");
var format = require("./format.js");

exports.errorResponse = function(request, response, code) {
  console.log("Serving error " + code);
  if(typeof(code) === "undefined")
    code = 500;
  response.setHeader("Content-Type", "text/html; charset=utf8");
  response.writeHead(code);
  fs.readFile(path.join(conf.template_dir, 'error.html'), function(err, data) {
    data = format.format(code);
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

exports.serveStatic = function(request, response, pathname) {
  console.log("Serving static '" + pathname + "'");
  var localFile = path.join(conf.static_dir, pathname);
  console.log("Which is '" + localFile + "'");
  path.exists(localFile, function (exists) {
    if (!exists) {
      //TODO: This returns true for Directories too
      errorResponse(request, response, 404);
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

// vi: set et sta sw=2 ts=2:
