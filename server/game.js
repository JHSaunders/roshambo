MIN_NUMBER = 916132832;
MAX_NUMBER = 56800235583;

var base62 = require('./base62');
var nonce  = require('./nonce.js');
var games  = exports.games = {};

exports.index = function(response) {
  var key = "";
  do {
    var num = MIN_NUMBER + (Math.random() * ((MAX_NUMBER - MIN_NUMBER) + 1));
    key = base62.encode(num);
  } while (key in games);
  games[key] = [];
  // return response page with key in it for link to play
  return response;
};

exports.gamePage = function(response, name) {
  if (name in games) {
    nonces = games[name];
    if (nonces.length < 2) {
      var n = new Nonce();
      nonces.push(n);
      // set cookie and return response
      response.writeHead(200, {
        'Set-Cookie'  : 'nonce=' + base62.encode(nonces),
        'Content-Type': 'text/plain',
      });
      return response;
    }
  }
  // Error handling
};

// vi: set et sta sw=2 ts=2:
