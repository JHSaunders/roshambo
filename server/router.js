var querystring = require("querystring");
var url = require("url");
var util = require("util");

var game = require("./game");
var static_ = require("./static");

// TODO Cache precompiled regexes for redirects and routes

var redirects = {
  '^/([0-9a-zA-Z]{6})$': '/$1/',
};

var routes = {
  '^/static/(.+)': static_.serveStatic,
  '^/$': game.index,
  '^/([0-9a-zA-Z]{6})/$': game.gamePage,
  '^/([0-9a-zA-Z]{6})/wait$': game.wait,
  '^/([0-9a-zA-Z]{6})/play$': game.play,
  '^/favicon.ico$': silent404,
};

function silent404(response, postData, cookies) {
  static_.errorResponse(response, 404, true);
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
  var postData = querystring.parse(postData);

  var hostname = null;
  if ('host' in request.headers)
    hostname = request.headers['host'];
  if ('x-forwarded-host' in request.headers)
    hostname = request.headers['x-forwarded-host'];
  if (hostname) {
    for(re in redirects) {
      match = pathname.match(re);
      if (match != null) {
        var dest = url.parse('http://' + pathname.replace(new RegExp(re), redirects[re]));
        dest.host = hostname;
        dest = url.format(dest);
        //console.log("Redirecting to: " + dest);
        response.setHeader('Location', dest);
        response.writeHead(302);
        response.end();
        return;
      }
    }
  }

  for(re in routes) {
    match = pathname.match(re);
    if (match != null) {
      args = [response, postData, cookies];
      for(i in match) {
        if (!parseInt(i))
          continue;
        args.push(match[i]);
      }
      //console.log("Route: " + re + " Params: " + args);
      return routes[re].apply(null, args);
    }
  }
  static_.errorResponse(response, 404);
};

// vi: set et sta sw=2 ts=2:
