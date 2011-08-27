var base62 = require('./base62');

MIN_NUMBER = 916132832;
MAX_NUMBER = 56800235583;

exports.games = {};

exports.index = function(response) {
  var key = "";
  do {
    var num = MIN_NUMBER + (Math.random() * ((MAX_NUMBER - MIN_NUMBER) + 1));
    key = base62.encode(num);
  } while (key in exports.games);
};

exports.gamePage = function(response, name) {
};

// vi: set et sta sw=2 ts=2:
