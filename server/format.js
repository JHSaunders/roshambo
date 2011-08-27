var fs = require("fs");
var path = require("path");

var conf = require("./conf.js");

exports.format = function() {
    var formatted = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        var regexp = new RegExp('\\{'+(i-1)+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

exports.serveTemplated = function() {
  var args = Array.prototype.slice.call(arguments);
  var response = args.shift();
  var template = args.shift();
  response.setHeader("Content-Type", "text/html; charset=utf8");
  response.writeHead(200);
  fs.readFile(path.join(conf.template_dir, template), 'utf8', function(err, data) {
    data = exports.format(data, args);
    response.write(data);
    response.end();
  });
}

// vi: set et sta sw=2 ts=2:
