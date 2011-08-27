MIN_NUMBER = 916132832;
MAX_NUMBER = 56800235583;

var base62 = require('./base62');
var games  = exports.games = {};

var format = require('./format');

function createNonce() {
  return base62.encode(new Date().getTime());
}

function getCookies(request) {
  // To Get a Cookie
  var cookies = {};
  request.headers.cookie && request.headers.cookie.split(';').forEach(function( cookie ) {
    var parts = cookie.split('=');
    cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
  });
  return cookies;
};

function getNonce(request) {
  return getCookies(request)['nonce'];
};

exports.index = function(request, response) {
  var key = "";
  do {
    var num = MIN_NUMBER + (Math.random() * ((MAX_NUMBER - MIN_NUMBER) + 1));
    key = base62.encode(Math.floor(num));
  } while (key in games);
  games[key] = [];
  format.serveTemplated(response, "index.html", key);
};

exports.gamePage = function(request, response, name) {
  if (name in games) {
    nonces = games[name];
    if (nonces.length < 2) {
      var n = createNonce();;
      nonces.push(n);
      // set cookie and return response
      response.setHeader('Set-Cookie', 'nonce=' + n);
      format.serveTemplated(response, "game.html")
    }
  }
  //TODO: Error handling
};

exports.wait = function(request, response, name) {
  var n = getNonce(request);
  if (typeof(n) != "undefined" && game[name].length === 2) {
    var p1 = game[name][0];
    var p2 = game[name][1];
  } 
};

exports.play = function(request, response, name) {
  var cookies = getCookies(request);
  if ('nonce' in cookies) {
    var n = cookies['nonce'];
  }
};

// vi: set et sta sw=2 ts=2:
