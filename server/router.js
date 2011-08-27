fs = require("fs");

function error(response, code) {
  if(typeof(code) == "undefined")
    code = 500;
  response.writeHead(code);
  fs.readFile('templates/error.html', function(err, data) {
    response.write(data);
    response.end();
  });
}

function route(pathname, response, postData) {
  console.log("Routing " + pathname);
  error(response);
  if (pathname.substring(0, 7) == "/static") {
    serveStatic(pathname.substring(7), response);
  }
}

exports.route = route

// vi: set et sta sw=2 ts=2:
