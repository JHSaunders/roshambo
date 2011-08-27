var fs = require("fs");
var path = require("path");

var conf = require("./conf");
var format = require("./format");

exports.errorResponse = function(response, code) {
  if(typeof(code) === "undefined")
    code = 500;
  response.setHeader("Content-Type", "text/html; charset=utf8");
  response.writeHead(code);
  fs.readFile(path.join(conf.template_dir, 'error.html'), 'utf8', function(err, data) {
    data = format.format(data, code);
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

exports.serveStatic = function(response, postData, cookies, pathname) {
  var localFile = path.join(conf.static_dir, pathname);
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

// vi: set et sta sw=2 ts=2:
