var util = require("util");

var game = require("./game");
var static_ = require("./static");

var routes = {
  '^/static/(.+)': static_.serveStatic,
  '^/$': game.index,
  '^/([0-9a-zA-Z]{6})/$': game.gamePage,
  '^/([0-9a-zA-Z]{6})/wait$': game.wait,
  '^/([0-9a-zA-Z]{6})/play$': game.play,
};

function getCookies(request) {
  // To Get a Cookie
  var cookies = {};
  request.headers.cookie && request.headers.cookie.split(';').forEach(function( cookie ) {
    var parts = cookie.split('=');
    cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
  });
  return cookies;
};

exports.route = function (pathname, request, response, postData) {
  console.log("Routing " + pathname);
  var cookies = getCookies(request);
  for(re in routes) {
    match = pathname.match(re);
    if (match != null) {
      args = [response, postData, cookies];
      for(i in match) {
        if (!parseInt(i))
          continue;
        args.push(match[i]);
      }
      console.log("Route: " + re + " Params: " + args);
      return routes[re].apply(null, args);
    }
  }
  static_.errorResponse(response, 404);
};

// vi: set et sta sw=2 ts=2:
