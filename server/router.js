var game = require("./game.js");
var static_ = require("./static.js");
var util = require("util");

var routes = {
  '^/static/(.+)': static_.serveStatic,
  '^/$': game.index,
  '^/[0-9a-zA-Z]{6}/$': game.gamePage,
  '^/[0-9a-zA-Z]{6}/wait$': game.wait,
  '^/[0-9a-zA-Z]{6}/play$': game.play,
};

exports.route = function (pathname, request, response, postData) {
  console.log("Routing " + pathname);
  for(re in routes) {
    match = pathname.match(re);
    if (match != null) {
      args = [request, response];
      for(i in match) {
        if (!parseInt(i))
          continue;
        args.push(match[i]);
      }
      console.log("Route: " + re + " Params: " + args);
      return routes[re].apply(null, args);
    }
  }
  static_.errorResponse(request, response, 404);
};

// vi: set et sta sw=2 ts=2:
